"use client"

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'

type Customer = {
  id: string
  name: string
  gst?: string | null
  city?: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [name, setName] = useState('')
  const [gst, setGst] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

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

  useEffect(() => { loadCustomers() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, gst, city, address, phone }),
    })

    if (res.ok) {
      setName('')
      setGst('')
      setCity('')
      setAddress('')
      setPhone('')
      setMessage('Customer created successfully.')
      loadCustomers()
    } else {
      setMessage('Could not create customer.')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Customers</h2>
      <p>Create and track customer profiles for dispatch and challan workflows.</p>

      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 20 }}>
        <input placeholder="Customer name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="GST" value={gst} onChange={e => setGst(e.target.value)} />
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <button type="submit">Create Customer</button>
      </form>

      {message ? <p>{message}</p> : null}

      <ul>
        {customers.map(customer => (
          <li key={customer.id} style={{ marginBottom: 8 }}>
            <Link href={`/customers/${customer.id}`}>{customer.name}</Link> — {customer.city ?? '—'} — {customer.gst ?? '—'}
          </li>
        ))}
      </ul>
    </main>
  )
}
