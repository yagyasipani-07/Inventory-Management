-- Dev mode anonymous access policies and schema permissions for all tables
-- Allows anon requests when authentication is disabled in development

-- 1. Grant PostgreSQL schema and table permissions to Supabase roles (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2. Dev mode anonymous access RLS policies
DROP POLICY IF EXISTS "Anon all access on user_profiles" ON user_profiles;
CREATE POLICY "Anon all access on user_profiles" ON user_profiles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on products" ON products;
CREATE POLICY "Anon all access on products" ON products FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on customers" ON customers;
CREATE POLICY "Anon all access on customers" ON customers FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on warehouses" ON warehouses;
CREATE POLICY "Anon all access on warehouses" ON warehouses FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on warehouse_stock" ON warehouse_stock;
CREATE POLICY "Anon all access on warehouse_stock" ON warehouse_stock FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on challans" ON challans;
CREATE POLICY "Anon all access on challans" ON challans FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on challan_items" ON challan_items;
CREATE POLICY "Anon all access on challan_items" ON challan_items FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on stock_movements" ON stock_movements;
CREATE POLICY "Anon all access on stock_movements" ON stock_movements FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on import_history" ON import_history;
CREATE POLICY "Anon all access on import_history" ON import_history FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on export_history" ON export_history;
CREATE POLICY "Anon all access on export_history" ON export_history FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on audit_logs" ON audit_logs;
CREATE POLICY "Anon all access on audit_logs" ON audit_logs FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon all access on settings" ON settings;
CREATE POLICY "Anon all access on settings" ON settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- 3. Also add sample seed data for testing
INSERT INTO user_profiles (id, name, email, role, active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Admin', 'demo@parasplywoods.com', 'Administrator', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (customer_number, customer_name, contact_person, phone, email, gst)
VALUES 
    ('CUST-001', 'Sharma Timber & Plywoods', 'Rajesh Sharma', '+91 9876543210', 'sharma@example.com', '07AABCU9603R1ZM'),
    ('CUST-002', 'Verma Furniture House', 'Amit Verma', '+91 9876543211', 'verma@example.com', '07AABCU9603R1ZN')
ON CONFLICT (customer_number) DO NOTHING;

INSERT INTO products (product_code, product_name, category, thickness, length, width, unit, brand, description, active_status)
VALUES 
    ('PLY-18-BWP', '18mm BWP Marine Plywood', 'Plywood', 18, 8, 4, 'sheet', 'Paras Gold', 'Premium marine grade waterproof plywood', true),
    ('PLY-12-MR', '12mm MR Commercial Plywood', 'Plywood', 12, 8, 4, 'sheet', 'Paras Standard', 'Commercial grade moisture resistant plywood', true)
ON CONFLICT (product_code) DO NOTHING;
