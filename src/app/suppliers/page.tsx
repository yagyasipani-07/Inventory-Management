"use client"

import { useEffect, useState, type FormEvent } from 'react'

type Supplier = {
  id: string
  name: string
  gst?: string | null
  address?: string | null
  phone?: string | null
  contactPerson?: string | null
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [name, setName] = useState('')
  const [gst, setGst] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [message, setMessage] = useState('')

  async function loadSuppliers() {
    try {
      const res = await fetch('/api/suppliers')
      const data = await res.json()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch {
      setSuppliers([])
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, gst, address, phone, contactPerson }),
    })
    if (res.ok) {
      setName('')
      setGst('')
      setAddress('')
      setPhone('')
      setContactPerson('')
      setMessage('Supplier saved successfully.')
      loadSuppliers()
    } else {
      setMessage('Could not save supplier.')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Suppliers</h2>
      <p>Create and maintain supplier records for receiving and procurement.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 24 }}>
        <input placeholder="Supplier name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="GST" value={gst} onChange={(e) => setGst(e.target.value)} />
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Contact person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
        <button type="submit">Save supplier</button>
      </form>
      {message ? <p>{message}</p> : null}
      <ul style={{ display: 'grid', gap: 8, paddingLeft: 20 }}>
        {suppliers.map((supplier) => (
          <li key={supplier.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <strong>{supplier.name}</strong>
            <div style={{ color: '#475569', marginTop: 4 }}>
              {supplier.phone ? `Phone: ${supplier.phone}` : 'Phone: —'}
              {supplier.gst ? ` • GST: ${supplier.gst}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
