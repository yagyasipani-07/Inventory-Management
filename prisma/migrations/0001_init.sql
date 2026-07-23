-- Safe Supabase-compatible SQL for the initial Prisma schema
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = 'role') THEN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'WAREHOUSE_MANAGER', 'ACCOUNTANT', 'SALES', 'READ_ONLY');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = 'challanstatus') THEN
    CREATE TYPE "ChallanStatus" AS ENUM ('DRAFT', 'APPROVED', 'DISPATCHED', 'CANCELLED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = 'purchasestatus') THEN
    CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'RECEIVED', 'VERIFIED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'READ_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "slrNo" INTEGER,
    "mould" TEXT,
    "productCode" TEXT NOT NULL,
    "productQty" INTEGER,
    "qtyPcsPerBox" INTEGER,
    "packType" TEXT,
    "uValue" DOUBLE PRECISION,
    "lValue" DOUBLE PRECISION,
    "prodWt" DOUBLE PRECISION,
    "ulWt" DOUBLE PRECISION,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "preferredTransport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Purchase" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "purchaseNumber" TEXT,
    "transport" TEXT,
    "receivedBy" TEXT,
    "receivedTime" TIMESTAMP(3),
    "billFileUrl" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PurchaseLineItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION,
    CONSTRAINT "PurchaseLineItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Challan" (
    "id" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "challanDate" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "transport" TEXT,
    "status" "ChallanStatus" NOT NULL DEFAULT 'DRAFT',
    "totalQty" INTEGER,
    "gstPercent" DOUBLE PRECISION,
    "terms" TEXT,
    "checkedBy" TEXT,
    "authorisedBy" TEXT,
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Challan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ChallanLineItem" (
    "id" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,
    CONSTRAINT "ChallanLineItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_productCode_key" ON "Product"("productCode");
CREATE UNIQUE INDEX IF NOT EXISTS "Challan_challanNumber_key" ON "Challan"("challanNumber");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Purchase_supplierId_fkey') THEN
    ALTER TABLE "Purchase"
      ADD CONSTRAINT "Purchase_supplierId_fkey"
      FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseLineItem_purchaseId_fkey') THEN
    ALTER TABLE "PurchaseLineItem"
      ADD CONSTRAINT "PurchaseLineItem_purchaseId_fkey"
      FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseLineItem_productId_fkey') THEN
    ALTER TABLE "PurchaseLineItem"
      ADD CONSTRAINT "PurchaseLineItem_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Challan_customerId_fkey') THEN
    ALTER TABLE "Challan"
      ADD CONSTRAINT "Challan_customerId_fkey"
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Challan_createdById_fkey') THEN
    ALTER TABLE "Challan"
      ADD CONSTRAINT "Challan_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Challan_approvedById_fkey') THEN
    ALTER TABLE "Challan"
      ADD CONSTRAINT "Challan_approvedById_fkey"
      FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChallanLineItem_challanId_fkey') THEN
    ALTER TABLE "ChallanLineItem"
      ADD CONSTRAINT "ChallanLineItem_challanId_fkey"
      FOREIGN KEY ("challanId") REFERENCES "Challan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ChallanLineItem_productId_fkey') THEN
    ALTER TABLE "ChallanLineItem"
      ADD CONSTRAINT "ChallanLineItem_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
