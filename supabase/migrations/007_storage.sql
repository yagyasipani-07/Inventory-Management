-- Insert storage buckets into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('product-images', 'product-images', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']), -- 5MB limit
    ('company-assets', 'company-assets', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/svg+xml']), -- 10MB limit
    ('challans', 'challans', false, 10485760, ARRAY['application/pdf']),
    ('imports', 'imports', false, 20971520, ARRAY['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
    ('exports', 'exports', false, 20971520, ARRAY['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
