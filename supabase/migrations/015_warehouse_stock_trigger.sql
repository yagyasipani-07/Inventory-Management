-- =============================================================================
-- MIGRATION 015: WAREHOUSE STOCK SYNCHRONIZATION AND TRIGGERS
-- =============================================================================
-- Root Cause: Products created without an initial stock balance didn't get a 
-- `warehouse_stock` record. The `dispatch_challan` RPC requires this record
-- to exist (even if qty is 0) to safely lock the row for concurrency.
-- This migration guarantees that every product always has a stock record in
-- every active warehouse.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1 — Historical Backfill (Idempotent)
-- -----------------------------------------------------------------------------
-- Cross join all active products with all active warehouses and insert a
-- 0-quantity record if one does not already exist.
INSERT INTO warehouse_stock (warehouse_id, product_id, current_quantity, reserved_quantity, reorder_level)
SELECT w.id, p.id, 0, 0, 0
FROM products p
CROSS JOIN warehouses w
WHERE p.active_status = true
  AND p.deleted_at IS NULL
  AND w.active_status = true
  AND w.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM warehouse_stock ws 
      WHERE ws.warehouse_id = w.id AND ws.product_id = p.id
  );

-- -----------------------------------------------------------------------------
-- STEP 2 — Product Insert Trigger
-- -----------------------------------------------------------------------------
-- Automatically create warehouse_stock records in all active warehouses 
-- whenever a new product is created.
CREATE OR REPLACE FUNCTION public.handle_new_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO warehouse_stock (warehouse_id, product_id, current_quantity, reserved_quantity, reorder_level)
    SELECT w.id, NEW.id, 0, 0, 0
    FROM warehouses w
    WHERE w.active_status = true
      AND w.deleted_at IS NULL
      AND NOT EXISTS (
          SELECT 1 FROM warehouse_stock ws 
          WHERE ws.warehouse_id = w.id AND ws.product_id = NEW.id
      );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_product_created_create_stock ON products;
CREATE TRIGGER on_product_created_create_stock
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_product_stock();

-- -----------------------------------------------------------------------------
-- STEP 3 — Warehouse Insert Trigger
-- -----------------------------------------------------------------------------
-- Automatically create warehouse_stock records for all active products 
-- whenever a new warehouse is created.
CREATE OR REPLACE FUNCTION public.handle_new_warehouse_stock()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO warehouse_stock (warehouse_id, product_id, current_quantity, reserved_quantity, reorder_level)
    SELECT NEW.id, p.id, 0, 0, 0
    FROM products p
    WHERE p.active_status = true
      AND p.deleted_at IS NULL
      AND NOT EXISTS (
          SELECT 1 FROM warehouse_stock ws 
          WHERE ws.warehouse_id = NEW.id AND ws.product_id = p.id
      );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_warehouse_created_create_stock ON warehouses;
CREATE TRIGGER on_warehouse_created_create_stock
    AFTER INSERT ON warehouses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_warehouse_stock();

-- -----------------------------------------------------------------------------
-- STEP 4 — Force PostgREST schema cache reload
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
