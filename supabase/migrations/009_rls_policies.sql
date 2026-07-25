-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE challan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS text AS $$
  SELECT role::text FROM public.user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (auth_user_role() = 'Administrator');
CREATE POLICY "Admins can manage profiles" ON user_profiles FOR ALL USING (auth_user_role() = 'Administrator');

-- Products Policies
CREATE POLICY "Anyone authenticated can view products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can insert products" ON products FOR INSERT WITH CHECK (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can update products" ON products FOR UPDATE USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth_user_role() = 'Administrator');

-- Customers Policies
CREATE POLICY "Anyone authenticated can view customers" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can insert customers" ON customers FOR INSERT WITH CHECK (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can update customers" ON customers FOR UPDATE USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Admins can delete customers" ON customers FOR DELETE USING (auth_user_role() = 'Administrator');

-- Warehouses Policies
CREATE POLICY "Anyone authenticated can view warehouses" ON warehouses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage warehouses" ON warehouses FOR ALL USING (auth_user_role() = 'Administrator');

-- Warehouse Stock Policies
CREATE POLICY "Anyone authenticated can view stock" ON warehouse_stock FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can update stock" ON warehouse_stock FOR UPDATE USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Admins can delete stock" ON warehouse_stock FOR DELETE USING (auth_user_role() = 'Administrator');

-- Challans Policies
CREATE POLICY "Anyone authenticated can view challans" ON challans FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create draft challans" ON challans FOR INSERT WITH CHECK (auth_user_role() IN ('Staff', 'Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can update challans" ON challans FOR UPDATE USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Admins can delete challans" ON challans FOR DELETE USING (auth_user_role() = 'Administrator');

-- Challan Items Policies
CREATE POLICY "Anyone authenticated can view challan items" ON challan_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create challan items" ON challan_items FOR INSERT WITH CHECK (auth_user_role() IN ('Staff', 'Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can update challan items" ON challan_items FOR UPDATE USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Admins can delete challan items" ON challan_items FOR DELETE USING (auth_user_role() = 'Administrator');

-- Stock Movements Policies
CREATE POLICY "Anyone authenticated can view stock movements" ON stock_movements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can create stock movements" ON stock_movements FOR INSERT WITH CHECK (auth_user_role() IN ('Manager', 'Administrator'));

-- Import & Export History Policies
CREATE POLICY "Managers and Admins can view imports and exports" ON import_history FOR SELECT USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can create imports" ON import_history FOR INSERT WITH CHECK (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can view exports" ON export_history FOR SELECT USING (auth_user_role() IN ('Manager', 'Administrator'));
CREATE POLICY "Managers and Admins can create exports" ON export_history FOR INSERT WITH CHECK (auth_user_role() IN ('Manager', 'Administrator'));

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (auth_user_role() = 'Administrator');
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Settings Policies
CREATE POLICY "Anyone authenticated can view settings" ON settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (auth_user_role() = 'Administrator');
CREATE POLICY "Admins can insert settings" ON settings FOR INSERT WITH CHECK (auth_user_role() = 'Administrator');
CREATE POLICY "Admins can delete settings" ON settings FOR DELETE USING (auth_user_role() = 'Administrator');
