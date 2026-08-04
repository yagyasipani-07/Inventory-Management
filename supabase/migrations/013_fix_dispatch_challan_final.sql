-- =============================================================================
-- MIGRATION 013: DEFINITIVE FIX — DISPATCH CHALLAN RPC
-- =============================================================================
-- Root Cause: Migration 012 was never applied to the live Supabase project.
-- The live DB had the old 3-param dispatch_challan(UUID, UUID, UUID) from
-- migration 010. PostgREST schema cache reported "function not found" when the
-- frontend called the 7-param version.
-- This migration:
--   1. Drops ALL old overloads of dispatch_challan
--   2. Creates the definitive production-grade 7-param version
--   3. Also applies the schema additions from 012 (idempotent via IF NOT EXISTS)
--   4. Forces a PostgREST schema cache reload
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1 — Schema additions from 012 (idempotent — safe to re-run)
-- -----------------------------------------------------------------------------

ALTER TABLE stock_movements
    ADD COLUMN IF NOT EXISTS purchase_bill_number VARCHAR(100);

ALTER TABLE challans
    ADD COLUMN IF NOT EXISTS transport VARCHAR(100),
    ADD COLUMN IF NOT EXISTS transport_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- -----------------------------------------------------------------------------
-- STEP 2 — Stabilize RLS policies (idempotent)
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Managers and Admins can update challans" ON challans;
DROP POLICY IF EXISTS "Authenticated users can update challans" ON challans;

CREATE POLICY "Authenticated users can update challans" ON challans
    FOR UPDATE TO authenticated, anon
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Managers and Admins can update stock" ON warehouse_stock;
DROP POLICY IF EXISTS "Authenticated users can update stock" ON warehouse_stock;

CREATE POLICY "Authenticated users can update stock" ON warehouse_stock
    FOR UPDATE TO authenticated, anon
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can create draft challans" ON challans;
DROP POLICY IF EXISTS "Authenticated users can insert challans" ON challans;

CREATE POLICY "Authenticated users can insert challans" ON challans
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- STEP 3 — Drop ALL existing overloads of dispatch_challan
-- -----------------------------------------------------------------------------
-- Drop the 3-param overload from migration 010
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID, UUID, UUID);

-- Drop the 7-param overload from migration 012 (in case 012 was partially applied)
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID, UUID, UUID, TEXT, TEXT, TEXT, TIMESTAMPTZ);

-- Catch any other possible signatures
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID);

-- -----------------------------------------------------------------------------
-- STEP 4 — Create the definitive production-grade dispatch_challan function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.dispatch_challan(
    p_challan_id    UUID,
    p_warehouse_id  UUID          DEFAULT NULL,
    p_user_id       UUID          DEFAULT NULL,
    p_transport     TEXT          DEFAULT NULL,
    p_transport_name TEXT         DEFAULT NULL,
    p_vehicle_number TEXT         DEFAULT NULL,
    p_dispatch_date  TIMESTAMPTZ  DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_status         challan_status;
    v_item           RECORD;
    v_current_stock  INTEGER;
    v_warehouse_id   UUID;
    v_user_id        UUID;
BEGIN
    -- -------------------------------------------------------------------------
    -- 1. Resolve warehouse (fall back to first active warehouse)
    -- -------------------------------------------------------------------------
    IF p_warehouse_id IS NULL THEN
        SELECT id INTO v_warehouse_id
        FROM warehouses
        WHERE active_status = true
        ORDER BY created_at ASC
        LIMIT 1;

        IF v_warehouse_id IS NULL THEN
            RAISE EXCEPTION 'No active warehouse found. Cannot dispatch challan.';
        END IF;
    ELSE
        -- Validate that the supplied warehouse exists and is active
        IF NOT EXISTS (SELECT 1 FROM warehouses WHERE id = p_warehouse_id AND active_status = true) THEN
            RAISE EXCEPTION 'Warehouse % is not active or does not exist.', p_warehouse_id;
        END IF;
        v_warehouse_id := p_warehouse_id;
    END IF;

    -- -------------------------------------------------------------------------
    -- 2. Resolve user ID
    -- -------------------------------------------------------------------------
    v_user_id := COALESCE(
        p_user_id,
        auth.uid(),
        (SELECT created_by_id FROM challans WHERE id = p_challan_id)
    );

    -- -------------------------------------------------------------------------
    -- 3. Validate challan — lock for update to prevent concurrent dispatches
    -- -------------------------------------------------------------------------
    SELECT status INTO v_status
    FROM challans
    WHERE id = p_challan_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Challan % not found.', p_challan_id;
    END IF;

    IF v_status != 'Approved' THEN
        RAISE EXCEPTION 'Challan cannot be dispatched. Current status: %. Only Approved challans can be dispatched.', v_status;
    END IF;

    -- -------------------------------------------------------------------------
    -- 4. Validate that challan has at least one item
    -- -------------------------------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM challan_items WHERE challan_id = p_challan_id) THEN
        RAISE EXCEPTION 'Challan % has no items. Cannot dispatch an empty challan.', p_challan_id;
    END IF;

    -- -------------------------------------------------------------------------
    -- 5. Process each challan item — validate stock, deduct, log movement
    -- -------------------------------------------------------------------------
    FOR v_item IN
        SELECT ci.product_id, ci.quantity, p.product_name
        FROM challan_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.challan_id = p_challan_id
    LOOP
        -- Lock the stock record for this product in this warehouse
        SELECT current_quantity INTO v_current_stock
        FROM warehouse_stock
        WHERE warehouse_id = v_warehouse_id
          AND product_id = v_item.product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'No stock record found for product "%" (%) in warehouse %. '
                'Please ensure opening stock has been entered.',
                v_item.product_name, v_item.product_id, v_warehouse_id;
        END IF;

        IF v_current_stock < v_item.quantity THEN
            RAISE EXCEPTION
                'Insufficient stock for product "%". Available: %, Required: %.',
                v_item.product_name, v_current_stock, v_item.quantity;
        END IF;

        -- Deduct stock
        UPDATE warehouse_stock
        SET current_quantity = current_quantity - v_item.quantity,
            updated_at       = NOW()
        WHERE warehouse_id = v_warehouse_id
          AND product_id   = v_item.product_id;

        -- Record stock movement
        INSERT INTO stock_movements (
            warehouse_id,
            product_id,
            previous_quantity,
            quantity_change,
            new_quantity,
            movement_type,
            reference_id,
            remarks
        ) VALUES (
            v_warehouse_id,
            v_item.product_id,
            v_current_stock,
            -v_item.quantity,
            v_current_stock - v_item.quantity,
            'Dispatch',
            p_challan_id,
            'Challan dispatched — ' || COALESCE(p_transport_name, p_transport, 'N/A')
        );

    END LOOP;

    -- -------------------------------------------------------------------------
    -- 6. Update challan status and transport details
    -- -------------------------------------------------------------------------
    UPDATE challans
    SET status           = 'Dispatched',
        dispatch_date    = COALESCE(p_dispatch_date, CURRENT_TIMESTAMP),
        transport        = COALESCE(p_transport,      transport),
        transport_name   = COALESCE(p_transport_name, transport_name),
        vehicle_number   = COALESCE(p_vehicle_number, vehicle_number),
        updated_at       = NOW()
    WHERE id = p_challan_id;

    -- -------------------------------------------------------------------------
    -- 7. Audit log
    -- -------------------------------------------------------------------------
    INSERT INTO audit_logs (
        entity,
        entity_id,
        action,
        user_id,
        description,
        metadata
    ) VALUES (
        'Challan',
        p_challan_id,
        'Dispatch',
        v_user_id,
        'Challan dispatched successfully',
        jsonb_build_object(
            'warehouse_id',    v_warehouse_id,
            'transport',       p_transport,
            'transport_name',  p_transport_name,
            'vehicle_number',  p_vehicle_number,
            'dispatch_date',   COALESCE(p_dispatch_date, CURRENT_TIMESTAMP)
        )
    );

    RETURN TRUE;

EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise with full context so PostgREST surfaces the correct message
        RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- Grant execute to authenticated and anon roles (matches the app's auth mode)
GRANT EXECUTE ON FUNCTION public.dispatch_challan(UUID, UUID, UUID, TEXT, TEXT, TEXT, TIMESTAMPTZ)
    TO authenticated, anon;

-- -----------------------------------------------------------------------------
-- STEP 5 — Force PostgREST schema cache reload
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- -----------------------------------------------------------------------------
-- STEP 6 — Verification query (run this to confirm deployment)
-- -----------------------------------------------------------------------------
-- SELECT
--     p.proname                          AS function_name,
--     pg_get_function_arguments(p.oid)   AS arguments,
--     pg_get_function_result(p.oid)      AS return_type,
--     p.prosecdef                        AS security_definer
-- FROM pg_proc p
-- JOIN pg_namespace n ON n.oid = p.pronamespace
-- WHERE n.nspname = 'public'
--   AND p.proname = 'dispatch_challan';
