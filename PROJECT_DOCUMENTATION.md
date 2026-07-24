# Paras Plywoods — Inventory Management System
## Complete Technical Documentation & Architecture Reference

---

## 1. Executive Summary & Project Goal

**Paras Plywoods Inventory Management System** is a full-stack, warehouse-first web application designed for plywood inventory tracking, supplier purchasing, customer dispatch challans, bulk product CSV importing, printable challan invoice generation, and audit compliance logging.

The system enforces atomic inventory transactions:
- **Receiving Inbound Stock**: Purchases from suppliers increase live warehouse inventory upon verification.
- **Outbound Dispatches**: Dispatch challans move from `DRAFT` $\rightarrow$ `APPROVED` (stock reservation) $\rightarrow$ `DISPATCHED` (live stock deduction).
- **Audit Traceability**: All critical stock mutations, product creations, customer additions, and challan status changes are captured in an audit log.

---

## 2. Technology Stack & Ecosystem

| Technology Layer | Tool / Library | Version / Spec | Purpose in System |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** | `v14.2.15` (App Router) | Full-stack framework providing SSR, Server/Client components, and dynamic routing |
| **UI Library** | **React** | `v18.2.0` | Declarative UI rendering, client-side state management, and hook utilities |
| **Language** | **TypeScript** | `v5.5.4` | End-to-end static type checking across models, API contracts, and React components |
| **Database & ORM** | **PostgreSQL** & **Prisma** | `v15` & `v5.0.0` | Relational database storage, schema management, type-safe queries, and transactional operations |
| **Database Hosting** | **Supabase** | Client `v2.2.0` | Cloud PostgreSQL host integration supporting transaction-mode poolers & migration session poolers |
| **Data Parsing** | **PapaParse** & **XLSX** | `v5.4.1` & `v0.18.5` | Parsing CSV and Excel files for bulk product and inventory imports |
| **Styling** | **Vanilla CSS** & **PostCSS** | CSS3 & PostCSS 8 | Custom design tokens (`globals.css`), inline flex/grid layouts, responsive containers |
| **DevOps / Containers** | **Docker Compose** | Spec `3.8` | Containerized local PostgreSQL database instance (`postgres:15`) |

---

## 3. Project Directory & File Structure

```
Inventory-Management/
├── .env.example              # Environment variables template (Supabase DB, Anon keys)
├── .gitignore                # Git exclusions (node_modules, .env, build output)
├── docker-compose.yml        # Local PostgreSQL container configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── package.json              # Project metadata, dependencies, build & database scripts
├── package-lock.json         # Dependency tree lockfile
├── README.md                 # Basic setup guide & quickstart instructions
├── tsconfig.json             # TypeScript compiler settings & alias configuration (@/*)
├── prisma/
│   ├── schema.prisma         # Prisma data model, enums, relations, and DB datasource
│   └── migrations/           # Version-controlled SQL database migration scripts
└── src/
    ├── lib/
    │   ├── audit.ts          # Audit logging helper for recording system mutations
    │   ├── fallbackStore.ts  # Memory fallback store for standalone demo operations
    │   ├── prisma.ts         # Singleton Prisma Client instance avoiding duplicate connections
    │   └── supabaseClient.ts # Supabase client initialization for cloud storage/auth
    └── app/
        ├── globals.css       # Core global styling resets, typography, and button styles
        ├── layout.tsx        # Root layout wrapper with navigation bar & AuthGate provider
        ├── page.tsx          # Main Warehouse Dashboard displaying live metrics & navigation
        ├── audit/
        │   └── page.tsx      # System Audit Log viewer displaying historical activity
        ├── challans/
        │   ├── page.tsx      # Challans creation interface & status listing
        │   ├── [id]/page.tsx # Challan detail page with approval & dispatch workflow actions
        │   └── print/page.tsx# Print view container for physical challan invoice output
        ├── components/
        │   ├── AuthGate.tsx  # Client-side session check protecting routes against unauthenticated access
        │   ├── ChallanTemplate.tsx # Print-ready layout component for dispatch challans
        │   └── ImportPreview.tsx   # Live table preview component for CSV product imports
        ├── customers/
        │   ├── page.tsx      # Customer directory & creation form
        │   └── [id]/page.tsx # Detailed customer view with history tabs
        ├── import/
        │   └── page.tsx      # Bulk CSV text import page with live preview
        ├── login/
        │   └── page.tsx      # Demo authentication sign-in form with role selection
        ├── products/
        │   └── page.tsx      # Product catalog manager with stock adjustment fields
        ├── purchases/
        │   ├── page.tsx      # Purchase orders page with line item receiving
        │   └── [id]/page.tsx # Detailed view of individual purchase orders
        ├── suppliers/
        │   └── page.tsx      # Supplier directory & management form
        └── api/              # REST API Route Handlers
            ├── audit/route.ts
            ├── challans/route.ts & [id]/route.ts
            ├── customers/route.ts
            ├── import/route.ts
            ├── products/route.ts
            ├── purchases/route.ts & [id]/route.ts
            └── suppliers/route.ts
```

---

## 4. Database Schema & Data Models

### Enums
- **`Role`**: `ADMIN`, `WAREHOUSE_MANAGER`, `ACCOUNTANT`, `SALES`, `READ_ONLY`
- **`ChallanStatus`**: `DRAFT`, `APPROVED`, `DISPATCHED`, `CANCELLED`
- **`PurchaseStatus`**: `PENDING`, `RECEIVED`, `VERIFIED`

### Data Models & Entity Relationships

1. **`User`**: System user accounts with role-based attributes and relations to created/approved challans.
2. **`Product`**: Inventory catalog items storing SKU product codes, mould specs, current stock levels, reserved stock quantities, and low stock alert thresholds.
3. **`Customer`**: Client profiles storing GST numbers, delivery addresses, telephone contacts, and preferred transport carriers.
4. **`Supplier`**: Vendor entries storing company details, contact persons, and purchasing histories.
5. **`Purchase` & `PurchaseLineItem`**: Inbound inventory orders tracking vendor supplies, unit costs, and receiving dates.
6. **`Challan` & `ChallanLineItem`**: Outbound delivery documents managing dispatches, line item quantities, rates, customer targets, and approval signatures.
7. **`AuditLog`**: System compliance records capturing entity mutation types, old values, new values, user IDs, and timestamps.

---

## 5. Core System Workflows

### A. Inbound Stock Receiving
1. A **Supplier** is selected or created in the system.
2. A **Purchase Order** is generated in `PENDING` status.
3. **Line Items** (Products, Quantities, Unit Costs) are attached to the purchase order.
4. When the shipment arrives, clicking **Receive** executes a database transaction that:
   - Increments `Product.currentStock` by each line item's quantity.
   - Updates Purchase status to `RECEIVED` and logs receiving timestamps.
   - Emits an `AuditLog` entry.

### B. Outbound Challan Approval & Dispatch
1. A **Challan** is created for a selected Customer in `DRAFT` status with line items (Product, Qty, Rate).
2. **Approval Step (`DRAFT` $\rightarrow$ `APPROVED`)**:
   - Increments `Product.reservedStock` for each item, reserving stock for dispatch.
   - Records `approvedAt` timestamp.
3. **Dispatch Step (`APPROVED` $\rightarrow$ `DISPATCHED`)**:
   - Atomically decrements `Product.currentStock` and `Product.reservedStock`.
   - Records `dispatchedAt` timestamp.
   - Logs the dispatch action in `AuditLog`.

### C. Bulk Product CSV Importing
1. Users paste CSV rows in the format `productCode,mould,productQty,qtyPcsPerBox`.
2. The `ImportPreview` component parses and displays a live table preview.
3. Submitting executes a `POST /api/import` request that uses **Prisma `upsert`**:
   - If the `productCode` exists, it increments `currentStock` and updates specifications.
   - If the `productCode` is new, it creates the product entry.

---

## 6. REST API Reference Specification

| Endpoint | Method | Description | Request Body Payload | Response Format |
| :--- | :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Fetch all products sorted by creation date | None | `Array<Product>` |
| `/api/products` | `POST` | Create or adjust product stock | `{ productCode, mould, productQty, qtyPcsPerBox, adjustment, reason }` | `Product` |
| `/api/customers` | `GET` | Fetch all customers | None | `Array<Customer>` |
| `/api/customers` | `POST` | Create a new customer profile | `{ name, gst, city, address, phone, preferredTransport }` | `Customer` |
| `/api/suppliers` | `GET` | Fetch all suppliers sorted by name | None | `Array<Supplier>` |
| `/api/suppliers` | `POST` | Create a new supplier | `{ name, gst, address, phone, contactPerson }` | `Supplier` |
| `/api/purchases` | `GET` | Fetch purchases with supplier & line items | None | `Array<Purchase>` |
| `/api/purchases` | `POST` | Create a new purchase order | `{ purchaseNumber, supplierId }` | `Purchase` |
| `/api/purchases/[id]`| `GET` | Fetch single purchase details | None | `Purchase` |
| `/api/purchases/[id]`| `POST` | Add line item or mark received | `{ action: 'add-line-item'\|'receive', productId, qty, unitCost, receivedBy }` | `PurchaseLineItem \| { ok: true }` |
| `/api/challans` | `GET` | Fetch all challans with customers & line items | None | `Array<Challan>` |
| `/api/challans` | `POST` | Create draft challan (auto-upserts demo user) | `{ challanNumber, customerId, createdById, lineItems: [{ productId, qty, rate }] }` | `Challan` |
| `/api/challans/[id]`| `GET` | Fetch single challan with customer & items | None | `Challan` |
| `/api/challans/[id]`| `PATCH`| Update status (`APPROVED` \| `DISPATCHED`) | `{ status: 'APPROVED' \| 'DISPATCHED' }` | `Challan` |
| `/api/import` | `POST` | Bulk upsert products from CSV rows | `{ rows: [{ productCode, mould, productQty, qtyPcsPerBox }] }` | `{ created: number }` |
| `/api/audit` | `GET` | Fetch latest 20 audit log entries | None | `Array<AuditLog>` |

---

## 7. Local Setup & Deployment Guide

### Prerequisites
- Node.js `v18+`
- Docker Desktop (if running Postgres locally) OR Supabase account

### Installation Steps

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set `DATABASE_URL` and `DIRECT_URL` to your PostgreSQL database.

3. **Database Initialization**:
   - If using local Docker Postgres:
     ```bash
     docker-compose up -d
     ```
   - Generate Prisma Client and apply migrations:
     ```bash
     npx prisma generate
     npx prisma migrate deploy
     ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production Build & Verification**:
   ```bash
   npm run build
   npm run start
   ```

---

## 8. Codebase Health & Audit Status

This project has undergone a complete architectural audit and bug remediation. All 13 Next.js pages and API routes compile cleanly with zero TypeScript errors.

- **Verified Build Status**: `✓ Compiled successfully (13/13 pages static/dynamic)`
- **Database Safety**: Enforced atomic Prisma transactions for inventory updates and automatic demo user seed handling.
- **Security Compliance**: All real production credentials removed from `.env.example` template.
