type Supplier = {
  id: string
  name: string
  gst?: string | null
  address?: string | null
  phone?: string | null
  contactPerson?: string | null
  createdAt: string
}

type PurchaseLineItem = {
  id: string
  purchaseId: string
  productId: string
  qty: number
  unitCost?: number | null
  product?: { id: string; productCode?: string | null } | null
}

type Purchase = {
  id: string
  supplierId: string | null
  purchaseNumber?: string | null
  status: string
  createdAt: string
  supplier?: Supplier | null
  lineItems?: PurchaseLineItem[]
  receivedBy?: string | null
  receivedTime?: string | null
}

const fallbackStore = {
  suppliers: [] as Supplier[],
  purchases: [] as Purchase[],
}

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `fallback-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getFallbackSuppliers() {
  return fallbackStore.suppliers
}

export function getFallbackPurchases() {
  return fallbackStore.purchases
}

export function createFallbackSupplier(input: Partial<Supplier>) {
  const supplier: Supplier = {
    id: makeId(),
    name: input.name ?? 'Unnamed supplier',
    gst: input.gst ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    contactPerson: input.contactPerson ?? null,
    createdAt: new Date().toISOString(),
  }
  fallbackStore.suppliers.push(supplier)
  return supplier
}

export function createFallbackPurchase(input: { purchaseNumber?: string | null; supplierId?: string | null; status?: string }) {
  const purchase: Purchase = {
    id: makeId(),
    supplierId: input.supplierId ?? null,
    purchaseNumber: input.purchaseNumber ?? null,
    status: input.status ?? 'PENDING',
    createdAt: new Date().toISOString(),
    supplier: input.supplierId
      ? fallbackStore.suppliers.find((supplier) => supplier.id === input.supplierId) ?? null
      : null,
    lineItems: [],
  }
  fallbackStore.purchases.push(purchase)
  return purchase
}

export function addFallbackPurchaseLineItem(purchaseId: string, input: { productId: string; qty: number; unitCost?: number | null; productCode?: string | null }) {
  const purchase = fallbackStore.purchases.find((entry) => entry.id === purchaseId)
  if (!purchase) return null
  const lineItem: PurchaseLineItem = {
    id: makeId(),
    purchaseId,
    productId: input.productId,
    qty: input.qty,
    unitCost: input.unitCost ?? null,
    product: input.productCode ? { id: input.productId, productCode: input.productCode } : { id: input.productId },
  }
  purchase.lineItems = [...(purchase.lineItems ?? []), lineItem]
  return lineItem
}

export function receiveFallbackPurchase(purchaseId: string, receivedBy?: string | null) {
  const purchase = fallbackStore.purchases.find((entry) => entry.id === purchaseId)
  if (!purchase) return null
  purchase.status = 'RECEIVED'
  purchase.receivedBy = receivedBy ?? null
  purchase.receivedTime = new Date().toISOString()
  return purchase
}
