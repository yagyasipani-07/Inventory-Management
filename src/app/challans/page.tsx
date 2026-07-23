"use client"

import { useEffect, useState, type FormEvent } from 'react'

type Challan = {
  id: string
  challanNumber: string
  status: string
  customer?: { name?: string | null }
}

type Customer = {
  id: string
  name: string
}

type Product = {
  id: string
  productCode: string
}

type LineItem = {
  productId: string
  qty: string
  rate: string
}

export default function ChallansPage() {
  const [challans, setChallans] = useState<Challan[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [challanNumber, setChallanNumber] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([{ productId: '', qty: '1', rate: '' }])
  const [message, setMessage] = useState('')

  async function loadChallans() {
    try {
      const res = await fetch('/api/challans')
      const text = await res.text()
      const data = text ? JSON.parse(text) : []
      setChallans(Array.isArray(data) ? data : [])
    } catch {
      setChallans([])
    }
  }

  async function loadCustomers() {
    try {
      const res = await fetch('/api/customers')
      const text = await res.text()
      const data = text ? JSON.parse(text) : []
      setCustomers(Array.isArray(data) ? data : [])
    } catch {
      setCustomers([])
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch('/api/products')
      const text = await res.text()
      const data = text ? JSON.parse(text) : []
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    }
  }

  useEffect(() => {
    loadChallans()
    loadCustomers()
    loadProducts()
  }, [])

  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    setLineItems(items => items.map((item, idx) => idx === index ? { ...item, [field]: value } : item))
  }

  function addLineItem() {
    setLineItems(items => [...items, { productId: '', qty: '1', rate: '' }])
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/challans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challanNumber,
        customerId,
        createdById: 'demo-user',
        lineItems: lineItems.filter(item => item.productId).map(item => ({
          productId: item.productId,
          qty: Number(item.qty || 0),
          rate: item.rate ? Number(item.rate) : null,
        })),
      }),
    })

    if (res.ok) {
      setChallanNumber('')
      setCustomerId('')
      setLineItems([{ productId: '', qty: '1', rate: '' }])
      setMessage('Challan created successfully.')
      loadChallans()
    } else {
      setMessage('Could not create challan.')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Challans</h2>
      <p>Create draft challans and move them through approval and dispatch.</p>

      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, maxWidth: 640, marginBottom: 20 }}>
        <input placeholder="Challan number" value={challanNumber} onChange={e => setChallanNumber(e.target.value)} required />
        <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>

        {lineItems.map((item, index) => (
          <div key={index} style={{ display: 'grid', gap: 8, gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center' }}>
            <select value={item.productId} onChange={e => updateLineItem(index, 'productId', e.target.value)} required>
              <option value="">Select product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.productCode}</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Qty" value={item.qty} onChange={e => updateLineItem(index, 'qty', e.target.value)} required />
            <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateLineItem(index, 'rate', e.target.value)} />
          </div>
        ))}

        <button type="button" onClick={addLineItem}>Add item</button>
        <button type="submit">Create Challan</button>
      </form>

      {message ? <p>{message}</p> : null}

      <ul>
        {challans.map(ch => (
          <li key={ch.id}>{ch.challanNumber} — {ch.status} — {ch.customer?.name ?? 'No customer'}</li>
        ))}
      </ul>
    </main>
  )
}
