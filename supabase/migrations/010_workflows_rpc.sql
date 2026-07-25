-- -----------------------------------------------------------------------------
-- WORKFLOW 4 - DISPATCH CHALLAN (ATOMIC TRANSACTION)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION dispatch_challan(p_challan_id UUID, p_warehouse_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_status challan_status;
    v_item RECORD;
    v_current_stock INTEGER;
BEGIN
    -- 1. Lock the challan record and check status
    SELECT status INTO v_status FROM challans WHERE id = p_challan_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Challan not found';
    END IF;
    
    IF v_status != 'Approved' THEN
        RAISE EXCEPTION 'Only Approved challans can be dispatched';
    END IF;

    -- 2. Process each item in the challan
    FOR v_item IN SELECT * FROM challan_items WHERE challan_id = p_challan_id LOOP
        
        -- Lock the warehouse stock record
        SELECT current_quantity INTO v_current_stock 
        FROM warehouse_stock 
        WHERE warehouse_id = p_warehouse_id AND product_id = v_item.product_id 
        FOR UPDATE;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Stock record not found for product % in warehouse %', v_item.product_id, p_warehouse_id;
        END IF;

        IF v_current_stock < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Required: %', v_item.product_id, v_current_stock, v_item.quantity;
        END IF;

        -- Deduct stock
        UPDATE warehouse_stock 
        SET current_quantity = current_quantity - v_item.quantity,
            updated_at = NOW()
        WHERE warehouse_id = p_warehouse_id AND product_id = v_item.product_id;

        -- Insert stock movement
        INSERT INTO stock_movements (warehouse_id, product_id, previous_quantity, quantity_change, new_quantity, movement_type, reference_id, remarks)
        VALUES (p_warehouse_id, v_item.product_id, v_current_stock, -v_item.quantity, v_current_stock - v_item.quantity, 'Dispatch', p_challan_id, 'Challan dispatched');
        
    END LOOP;

    -- 3. Update challan status
    UPDATE challans 
    SET status = 'Dispatched', dispatch_date = CURRENT_DATE, updated_at = NOW() 
    WHERE id = p_challan_id;

    -- 4. Insert audit log
    INSERT INTO audit_logs (entity, entity_id, action, user_id, description, metadata)
    VALUES ('Challan', p_challan_id, 'Dispatch', p_user_id, 'Challan dispatched successfully', jsonb_build_object('warehouse_id', p_warehouse_id));

    RETURN TRUE;
END;
$$;

-- -----------------------------------------------------------------------------
-- WORKFLOW 6 & 7 - STOCK ADJUSTMENT (ATOMIC TRANSACTION)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION adjust_stock(p_warehouse_id UUID, p_product_id UUID, p_quantity_change INTEGER, p_movement_type movement_type, p_remarks TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stock INTEGER;
BEGIN
    -- Ensure stock record exists, lock for update, or create if missing (Opening Stock scenario)
    SELECT current_quantity INTO v_current_stock FROM warehouse_stock WHERE warehouse_id = p_warehouse_id AND product_id = p_product_id FOR UPDATE;
    
    IF NOT FOUND THEN
        IF p_quantity_change < 0 THEN
            RAISE EXCEPTION 'Cannot reduce stock below zero. Record does not exist.';
        END IF;
        
        -- Create initial stock record
        INSERT INTO warehouse_stock (warehouse_id, product_id, current_quantity) VALUES (p_warehouse_id, p_product_id, p_quantity_change);
        v_current_stock := 0; -- For movement log context
    ELSE
        IF (v_current_stock + p_quantity_change) < 0 THEN
            RAISE EXCEPTION 'Insufficient stock. Cannot reduce below zero.';
        END IF;
        
        -- Update existing stock
        UPDATE warehouse_stock 
        SET current_quantity = current_quantity + p_quantity_change, updated_at = NOW() 
        WHERE warehouse_id = p_warehouse_id AND product_id = p_product_id;
    END IF;

    -- Insert movement
    INSERT INTO stock_movements (warehouse_id, product_id, previous_quantity, quantity_change, new_quantity, movement_type, remarks)
    VALUES (p_warehouse_id, p_product_id, COALESCE(v_current_stock, 0), p_quantity_change, COALESCE(v_current_stock, 0) + p_quantity_change, p_movement_type, p_remarks);

    -- Audit
    INSERT INTO audit_logs (entity, entity_id, action, user_id, description)
    VALUES ('Product', p_product_id, 'Update', p_user_id, 'Stock adjusted: ' || p_remarks);

    RETURN TRUE;
END;
$$;
