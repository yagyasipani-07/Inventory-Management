-- Unique Constraints
ALTER TABLE products ADD CONSTRAINT uk_products_product_code UNIQUE (product_code);
ALTER TABLE customers ADD CONSTRAINT uk_customers_customer_number UNIQUE (customer_number);
ALTER TABLE warehouses ADD CONSTRAINT uk_warehouses_code UNIQUE (code);
ALTER TABLE warehouse_stock ADD CONSTRAINT uk_warehouse_stock_warehouse_product UNIQUE (warehouse_id, product_id);
ALTER TABLE challans ADD CONSTRAINT uk_challans_challan_number UNIQUE (challan_number);

-- Foreign Key Constraints
ALTER TABLE warehouse_stock
    ADD CONSTRAINT fk_warehouse_stock_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_warehouse_stock_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE challans
    ADD CONSTRAINT fk_challans_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_challans_created_by FOREIGN KEY (created_by_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE challan_items
    ADD CONSTRAINT fk_challan_items_challan FOREIGN KEY (challan_id) REFERENCES challans(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_challan_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE stock_movements
    ADD CONSTRAINT fk_stock_movements_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE import_history
    ADD CONSTRAINT fk_import_history_user FOREIGN KEY (imported_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE export_history
    ADD CONSTRAINT fk_export_history_user FOREIGN KEY (generated_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Check Constraints (Business Rules)
ALTER TABLE warehouse_stock ADD CONSTRAINT chk_warehouse_stock_current_quantity CHECK (current_quantity >= 0);
ALTER TABLE warehouse_stock ADD CONSTRAINT chk_warehouse_stock_reserved_quantity CHECK (reserved_quantity >= 0);
ALTER TABLE challan_items ADD CONSTRAINT chk_challan_items_quantity CHECK (quantity > 0);
