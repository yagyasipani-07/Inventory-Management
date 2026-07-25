-- B-Tree Indexes for frequently searched or joined fields
CREATE INDEX idx_products_product_name ON products(product_name);
CREATE INDEX idx_products_product_code ON products(product_code);
CREATE INDEX idx_products_active_status ON products(active_status);

CREATE INDEX idx_customers_customer_name ON customers(customer_name);
CREATE INDEX idx_customers_customer_number ON customers(customer_number);

CREATE INDEX idx_challans_challan_number ON challans(challan_number);
CREATE INDEX idx_challans_customer_id ON challans(customer_id);
CREATE INDEX idx_challans_dispatch_date ON challans(dispatch_date);
CREATE INDEX idx_challans_status ON challans(status);

CREATE INDEX idx_stock_movements_warehouse_id ON stock_movements(warehouse_id);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);

CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
