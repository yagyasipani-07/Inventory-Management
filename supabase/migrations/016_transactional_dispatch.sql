-- =============================================================================
-- MIGRATION 016: TRANSACTIONAL DISPATCH & STOCK ENGINE
-- =============================================================================
-- This migration introduces a centralized, atomic stock engine to replace the
-- vulnerable client-side orchestration.
-- It provides three core RPCs:
-- 1. process_stock_movement: Handles all math, locking, and movement logging.
-- 2. execute_dispatch_challan: Transactionally loops over challan items.
-- 3. sync_inventory_state: Self-healing utility for historical data.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1 — Core Atomic Stock Engine
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_stock_movement(
    p_warehouse_id UUID,
    p_product_id UUID,
    p_quantity_change INTEGER,
    p_movement_type movement_type,
    p_reference_id UUID DEFAULT NULL,
    p_remarks TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_purchase_bill_number VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_stock INTEGER;
    v_new_stock INTEGER;
    v_product_name TEXT;
BEGIN
    -- 1. Fetch product name for better error messages
    SELECT product_name INTO v_product_name FROM products WHERE id = p_product_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product % not found.', p_product_id;
    END IF;

    -- 2. Lock the stock row exclusively for update
    SELECT current_quantity INTO v_current_stock
    FROM warehouse_stock
    WHERE warehouse_id = p_warehouse_id AND product_id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock record missing for "%" in warehouse %.', v_product_name, p_warehouse_id;
    END IF;

    -- 3. Validate stock limits
    v_new_stock := v_current_stock + p_quantity_change;
    
    IF v_new_stock < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Required: %.', 
            v_product_name, v_current_stock, abs(p_quantity_change);
    END IF;

    -- 4. Update the stock quantity
    UPDATE warehouse_stock
    SET current_quantity = v_new_stock,
        updated_at = NOW()
    WHERE warehouse_id = p_warehouse_id AND product_id = p_product_id;

    -- 5. Insert the movement history
    INSERT INTO stock_movements (
        warehouse_id,
        product_id,
        previous_quantity,
        quantity_change,
        new_quantity,
        movement_type,
        reference_id,
        remarks,
        purchase_bill_number
    ) VALUES (
        p_warehouse_id,
        p_product_id,
        v_current_stock,
        p_quantity_change,
        v_new_stock,
        p_movement_type,
        p_reference_id,
        p_remarks,
        p_purchase_bill_number
    );

    RETURN TRUE;
END;
$$;

-- -----------------------------------------------------------------------------
-- STEP 2 — Transactional Dispatch Workflow
-- -----------------------------------------------------------------------------
-- Drop all old versions to be absolutely safe
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID);
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID, UUID, UUID);
DROP FUNCTION IF EXISTS public.dispatch_challan(UUID, UUID, UUID, TEXT, TEXT, TEXT, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION public.execute_dispatch_challan(
    p_challan_id UUID,
    p_warehouse_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_transport TEXT DEFAULT NULL,
    p_transport_name TEXT DEFAULT NULL,
    p_vehicle_number TEXT DEFAULT NULL,
    p_dispatch_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_status challan_status;
    v_item RECORD;
    v_warehouse_id UUID;
    v_user_id UUID;
BEGIN
    -- 1. Resolve Warehouse
    IF p_warehouse_id IS NULL THEN
        SELECT id INTO v_warehouse_id FROM warehouses WHERE active_status = true ORDER BY created_at ASC LIMIT 1;
        IF v_warehouse_id IS NULL THEN
            RAISE EXCEPTION 'No active warehouse found.';
        END IF;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM warehouses WHERE id = p_warehouse_id AND active_status = true) THEN
            RAISE EXCEPTION 'Warehouse is not active or does not exist.';
        END IF;
        v_warehouse_id := p_warehouse_id;
    END IF;

    -- 2. Resolve User
    v_user_id := COALESCE(p_user_id, auth.uid(), (SELECT created_by_id FROM challans WHERE id = p_challan_id));

    -- 3. Lock and validate Challan
    SELECT status INTO v_status FROM challans WHERE id = p_challan_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Challan not found.';
    END IF;
    IF v_status != 'Approved' THEN
        RAISE EXCEPTION 'Challan cannot be dispatched. Status is %. (Expected: Approved)', v_status;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM challan_items WHERE challan_id = p_challan_id) THEN
        RAISE EXCEPTION 'Challan has no items.';
    END IF;

    -- 4. Process each item transactionally via the core engine
    FOR v_item IN SELECT product_id, quantity FROM challan_items WHERE challan_id = p_challan_id
    LOOP
        PERFORM public.process_stock_movement(
            v_warehouse_id,
            v_item.product_id,
            -v_item.quantity,  -- Negative because it's a dispatch
            'Dispatch'::movement_type,
            p_challan_id,
            'Challan dispatched — ' || COALESCE(p_transport_name, p_transport, 'N/A'),
            v_user_id,
            NULL
        );
    END LOOP;

    -- 5. Update Challan metadata
    UPDATE challans
    SET status = 'Dispatched',
        dispatch_date = COALESCE(p_dispatch_date, CURRENT_TIMESTAMP),
        transport = COALESCE(p_transport, transport),
        transport_name = COALESCE(p_transport_name, transport_name),
        vehicle_number = COALESCE(p_vehicle_number, vehicle_number),
        updated_at = NOW()
    WHERE id = p_challan_id;

    -- 6. Log Audit
    INSERT INTO audit_logs (entity, entity_id, action, user_id, description, metadata)
    VALUES (
        'Challan', p_challan_id, 'Dispatch', v_user_id, 'Challan dispatched successfully',
        jsonb_build_object('warehouse_id', v_warehouse_id, 'transport', p_transport, 'dispatch_date', p_dispatch_date)
    );

    RETURN TRUE;
END;
$$;

-- -----------------------------------------------------------------------------
-- STEP 3 — Self-Healing Synchronization
-- -----------------------------------------------------------------------------
-- This utility safely recalculates current_quantity by summing all historical movements.
-- Use this to repair drift caused by the old client-side architecture.
CREATE OR REPLACE FUNCTION public.sync_inventory_state()
RETURNS SETOF warehouse_stock
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
BEGIN
    FOR v_record IN 
        SELECT 
            m.warehouse_id, 
            m.product_id, 
            SUM(m.quantity_change) as calculated_stock
        FROM stock_movements m
        GROUP BY m.warehouse_id, m.product_id
    LOOP
        -- Only update if there is a discrepancy
        UPDATE warehouse_stock ws
        SET current_quantity = v_record.calculated_stock,
            updated_at = NOW()
        WHERE ws.warehouse_id = v_record.warehouse_id 
          AND ws.product_id = v_record.product_id
          AND ws.current_quantity != v_record.calculated_stock;
    END LOOP;
    
    RETURN QUERY SELECT * FROM warehouse_stock;
END;
$$;

-- -----------------------------------------------------------------------------
-- STEP 4 — Grant permissions and force schema cache reload
-- -----------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.process_stock_movement TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.execute_dispatch_challan TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.sync_inventory_state TO authenticated, anon;

NOTIFY pgrst, 'reload schema';
