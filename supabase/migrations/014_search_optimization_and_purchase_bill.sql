-- Composite index for stock lookups (product+warehouse join used in every inventory read)
CREATE INDEX IF NOT EXISTS idx_warehouse_stock_product_warehouse 
  ON warehouse_stock(product_id, warehouse_id);

-- Index deleted_at for soft-delete filters  
CREATE INDEX IF NOT EXISTS idx_products_deleted_at 
  ON products(deleted_at) WHERE deleted_at IS NULL;

-- Indexes for search/filter by category and brand
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Full-text search index on product_name and product_code
CREATE INDEX IF NOT EXISTS idx_products_fts 
  ON products USING gin(to_tsvector('english', coalesce(product_name,'') || ' ' || coalesce(product_code,'')));

-- Index purchase_bill_number on stock_movements for bill-based search
CREATE INDEX IF NOT EXISTS idx_stock_movements_purchase_bill 
  ON stock_movements(purchase_bill_number) WHERE purchase_bill_number IS NOT NULL;

-- Index for challan status+deleted_at (frequent filter pattern)
CREATE INDEX IF NOT EXISTS idx_challans_status_deleted 
  ON challans(status, deleted_at) WHERE deleted_at IS NULL;

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
