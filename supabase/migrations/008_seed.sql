-- Create a default warehouse
INSERT INTO warehouses (warehouse_name, code, address, active_status)
VALUES ('Main Warehouse', 'WH-MAIN', 'Primary Storage Facility', true)
ON CONFLICT (code) DO NOTHING;

-- Seed default application settings
INSERT INTO settings (key, value, description)
VALUES 
    ('company_info', '{"name": "Paras Plywoods", "gst": "", "address": "", "phone": "", "email": ""}', 'Global company information used for reports and challans.'),
    ('print_settings', '{"show_logo": true, "show_gst": true, "footer_text": "Thank you for your business."}', 'Settings for PDF generation.'),
    ('app_preferences', '{"theme": "system", "default_warehouse": "WH-MAIN"}', 'Default UI preferences.')
ON CONFLICT (key) DO NOTHING;
