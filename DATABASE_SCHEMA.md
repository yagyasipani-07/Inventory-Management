# Database Schema Documentation: Paras Plywoods ERP

This document outlines the core tables and relationships of the fully normalized Supabase PostgreSQL database for the Paras Plywoods ERP.

## 1. Products (`products`)
Stores the catalog of all items available.
* `id` (UUID, PK)
* `product_code` (VARCHAR, Unique) - e.g. 'MR-18-84'
* `product_name` (VARCHAR)
* `brand` (VARCHAR)
* `category` (VARCHAR)
* `thickness` (NUMERIC)
* `length` (NUMERIC)
* `width` (NUMERIC)
* `unit` (VARCHAR)
* `product_image_path` (TEXT)
* `active_status` (BOOLEAN)
* `created_at`, `updated_at`, `deleted_at`

## 2. Warehouses (`warehouses`)
Stores physical inventory locations.
* `id` (UUID, PK)
* `warehouse_name` (VARCHAR)
* `warehouse_code` (VARCHAR, Unique)
* `location_address` (TEXT)
* `is_active` (BOOLEAN)

## 3. Warehouse Stock (`warehouse_stock`)
Junction table tracking how much of each product is in which warehouse.
* `warehouse_id` (UUID, FK -> warehouses.id)
* `product_id` (UUID, FK -> products.id)
* `current_quantity` (INTEGER) - The physical stock.
* `reserved_quantity` (INTEGER) - Stock allocated to challans but not yet dispatched.
* `reorder_level` (INTEGER) - Minimum threshold.
* `reorder_quantity` (INTEGER)
* `last_restock_date` (TIMESTAMPTZ)
* **Primary Key**: `(warehouse_id, product_id)`

## 4. Customers (`customers`)
Stores buyer information.
* `id` (UUID, PK)
* `customer_number` (VARCHAR, Unique)
* `customer_name` (VARCHAR)
* `phone` (VARCHAR)
* `email` (VARCHAR)
* `notes` (TEXT)

## 5. Challans (`challans`)
Outbound dispatch records.
* `id` (UUID, PK)
* `challan_number` (VARCHAR, Unique)
* `customer_id` (UUID, FK -> customers.id)
* `status` (ENUM: 'Draft', 'Approved', 'Dispatched', 'Cancelled')
* `dispatch_date` (DATE)
* `notes` (TEXT)
* `created_by_id` (UUID, FK -> user_profiles.id)

## 6. Challan Items (`challan_items`)
Line items for outbound dispatches.
* `id` (UUID, PK)
* `challan_id` (UUID, FK -> challans.id)
* `product_id` (UUID, FK -> products.id)
* `quantity` (INTEGER) - Must be positive.

## 7. Stock Movements (`stock_movements`)
Immutable ledger of all stock changes (audit trail).
* `id` (UUID, PK)
* `warehouse_id` (UUID, FK)
* `product_id` (UUID, FK)
* `movement_type` (ENUM: 'Restock', 'Dispatch', 'Correction', 'Return')
* `previous_quantity` (INTEGER)
* `quantity_change` (INTEGER)
* `new_quantity` (INTEGER)
* `reference_id` (UUID) - Ties to Challan ID or Import ID.
* `remarks` (TEXT)

## 8. Audit Logs (`audit_logs`)
System-wide activity log.
* `id` (UUID, PK)
* `entity` (VARCHAR) - e.g. 'Product', 'Challan'
* `entity_id` (UUID)
* `action` (VARCHAR)
* `user_id` (UUID, FK -> user_profiles.id)
* `description` (TEXT)
* `metadata` (JSONB)
* `created_at` (TIMESTAMPTZ)

## 9. Settings (`settings`)
Global application configurations.
* `key` (VARCHAR, PK)
* `value` (JSONB)
* `description` (TEXT)

## 10. User Profiles (`user_profiles`)
Extends the native Supabase `auth.users` for RBAC.
* `id` (UUID, PK, FK -> auth.users.id)
* `email` (VARCHAR)
* `name` (VARCHAR)
* `role` (VARCHAR) - Administrator, Manager, Staff.
* `is_active` (BOOLEAN)

---

## Role Based Access Control (RLS)
The database enforces strict RLS:
- **Administrators**: Full CRUD access across all tables.
- **Managers**: Can read all, update stock, and process challans. Cannot alter system settings or delete users.
- **Staff**: Can read inventory/customers, and can create 'Draft' challans. Cannot dispatch stock or alter products.
