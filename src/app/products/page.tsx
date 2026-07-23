"use client"

import { useEffect, useState, type FormEvent } from 'react'

type Product = {
  id: string
  productCode: string
  mould?: string | null
  productQty?: number | null
  qtyPcsPerBox?: number | null
  currentStock?: number | null
  reservedStock?: number | null
  lowStockThreshold?: number | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productCode, setProductCode] = useState('')
  const [mould, setMould] = useState('')
  const [productQty, setProductQty] = useState('')
  const [qtyPcsPerBox, setQtyPcsPerBox] = useState('')
  const [adjustment, setAdjustment] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productCode,
        mould,
        productQty: productQty ? Number(productQty) : null,
        qtyPcsPerBox: qtyPcsPerBox ? Number(qtyPcsPerBox) : null,
        adjustment: adjustment ? Number(adjustment) : undefined,
        reason,
      }),
    })
    const result = await res.json()
    if (res.ok) {
      setProductCode('')
      setMould('')
      setProductQty('')
      setQtyPcsPerBox('')
      setAdjustment('')
      setReason('')
      setMessage('Product created successfully.')
      load()
    } else {
      setMessage(result.error || 'Create failed')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Products</h2>
      <p>Create and review products in the warehouse loop.</p>
      <form onSubmit={handleCreate} style={{ marginBottom: 16, display: 'grid', gap: 8, maxWidth: 480 }}>
        <input placeholder="Product code" value={productCode} onChange={e => setProductCode(e.target.value)} required />
        <input placeholder="Mould" value={mould} onChange={e => setMould(e.target.value)} />
        <input placeholder="Product Qty" type="number" value={productQty} onChange={e => setProductQty(e.target.value)} />
        <input placeholder="Qty per box" type="number" value={qtyPcsPerBox} onChange={e => setQtyPcsPerBox(e.target.value)} />
        <input placeholder="Stock adjustment (+/-)" type="number" value={adjustment} onChange={e => setAdjustment(e.target.value)} />
        <input placeholder="Adjustment reason" value={reason} onChange={e => setReason(e.target.value)} />
        <button type="submit">Create / Adjust Product</button>
      </form>

      {message ? <p>{message}</p> : null}

      <ul>
        {products.map(p => {
          const stock = Number(p.currentStock ?? 0)
          const reserved = Number(p.reservedStock ?? 0)
          const threshold = Number(p.lowStockThreshold ?? 0)
          const isLow = threshold > 0 && stock <= threshold

          return (
            <li key={p.id} style={{ marginBottom: 10, border: '1px solid #e5e7eb', padding: 10, borderRadius: 8 }}>
              <strong>{p.productCode}</strong> — {p.mould ?? 'No mould'}
              <div style={{ color: '#475569', marginTop: 4 }}>
                Qty: {p.productQty ?? 0} | Current Stock: {stock} | Reserved: {reserved} | Per Box: {p.qtyPcsPerBox ?? 0}
              </div>
              {isLow ? <div style={{ color: '#b91c1c', marginTop: 4 }}>Low stock warning</div> : null}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
