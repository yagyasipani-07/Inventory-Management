"use client"

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'

type Supplier = { id: string; name: string }
type Product = { id: string; productCode: string }
type Purchase = { id: string; purchaseNumber?: string | null; status?: string | null; supplier?: { name?: string | null } | null; lineItems?: Array<{ id: string; qty?: number | null; product?: { productCode?: string | null } | null }> }

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [purchaseNumber, setPurchaseNumber] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [qty, setQty] = useState('')
  const [unitCost, setUnitCost] = useState('')
  const [activePurchaseId, setActivePurchaseId] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    try {
      const [purchasesRes, suppliersRes, productsRes] = await Promise.all([
        fetch('/api/purchases'),
        fetch('/api/suppliers'),
        fetch('/api/products'),
      ])
      const purchasesData = await purchasesRes.json()
      const suppliersData = await suppliersRes.json()
      const productsData = await productsRes.json()
      setPurchases(Array.isArray(purchasesData) ? purchasesData : [])
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch {
      setPurchases([])
      setSuppliers([])
      setProducts([])
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchaseNumber, supplierId, createdById: 'demo-user' }),
    })
    if (res.ok) {
      const created = await res.json()
      setPurchaseNumber('')
      setSupplierId('')
      setActivePurchaseId(created.id)
      setMessage('Purchase created successfully.')
      loadData()
    } else {
      setMessage('Could not create purchase.')
    }
  }

  async function handleAddLineItem(purchaseId: string) {
    if (!selectedProductId || !qty) return
    const res = await fetch(`/api/purchases/${purchaseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add-line-item', productId: selectedProductId, qty: Number(qty), unitCost: Number(unitCost || 0) }),
    })
    if (res.ok) {
      setSelectedProductId('')
      setQty('')
      setUnitCost('')
      setMessage('Line item added to purchase.')
      loadData()
    } else {
      setMessage('Could not add line item.')
    }
  }

  async function handleReceive(purchaseId: string) {
    const res = await fetch(`/api/purchases/${purchaseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'receive', receivedBy: 'demo-user' }),
    })
    if (res.ok) {
      setMessage('Purchase received and stock updated.')
      loadData()
    } else {
      setMessage('Could not receive purchase.')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Purchases</h2>
      <p>Create purchase entries to track inbound stock and suppliers.</p>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 20 }}>
        <input placeholder="Purchase number" value={purchaseNumber} onChange={e => setPurchaseNumber(e.target.value)} required />
        <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
          <option value="">Select supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
        <button type="submit">Create Purchase</button>
      </form>
      {message ? <p>{message}</p> : null}
      <ul style={{ display: 'grid', gap: 12, paddingLeft: 20 }}>
        {purchases.map(purchase => (
          <li key={purchase.id} style={{ marginBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div><strong>{purchase.purchaseNumber ?? 'Purchase'}</strong> — {purchase.status ?? 'PENDING'} — {purchase.supplier?.name ?? 'No supplier'}</div>
            <div style={{ marginTop: 4 }}><Link href={`/purchases/${purchase.id}`}>Open details</Link></div>
            <div style={{ marginTop: 8 }}>
              {purchase.lineItems?.length ? purchase.lineItems.map(item => (
                <span key={item.id} style={{ display: 'inline-block', marginRight: 8, background: '#f3f4f6', padding: '2px 6px', borderRadius: 999 }}> {item.product?.productCode ?? 'item'} × {item.qty ?? 0}</span>
              )) : <span>No line items yet</span>}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select value={activePurchaseId === purchase.id ? selectedProductId : ''} onChange={e => { setActivePurchaseId(purchase.id); setSelectedProductId(e.target.value) }}>
                <option value="">Select product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.productCode}</option>
                ))}
              </select>
              <input type="number" placeholder="Qty" style={{ width: 90 }} value={activePurchaseId === purchase.id ? qty : ''} onChange={e => { setActivePurchaseId(purchase.id); setQty(e.target.value) }} />
              <input type="number" placeholder="Unit cost" style={{ width: 110 }} value={activePurchaseId === purchase.id ? unitCost : ''} onChange={e => { setActivePurchaseId(purchase.id); setUnitCost(e.target.value) }} />
              <button type="button" onClick={() => handleAddLineItem(purchase.id)}>Add Line</button>
              <button type="button" onClick={() => handleReceive(purchase.id)} disabled={purchase.status === 'RECEIVED'}>Receive</button>
            </div>
          </li>
        ))}
      </ul>
      <p style={{ color: '#475569' }}>This page now covers the receiving side of the warehouse workflow.</p>
    </main>
  )
}
