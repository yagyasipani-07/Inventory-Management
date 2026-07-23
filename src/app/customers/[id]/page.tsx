"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Customer = {
  id: string
  name: string
  gst?: string | null
  address?: string | null
}

type TabKey = 'overview' | 'challans' | 'invoices' | 'activity'

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const res = await fetch('/api/customers')
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        const found = Array.isArray(data) ? data.find((item: Customer) => item.id === params.id) : null
        setCustomer(found ?? null)
      } catch {
        setCustomer(null)
      }
    }

    loadCustomer()
  }, [params.id])

  if (!customer) return <main style={{ padding: 24 }}>Loading…</main>

  return (
    <main style={{ padding: 24 }}>
      <h2>{customer.name}</h2>
      <p>GST: {customer.gst ?? '—'}</p>
      <p>Address: {customer.address ?? '—'}</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {(['overview', 'challans', 'invoices', 'activity'] as TabKey[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'overview' && (
          <div>
            <p><strong>Customer summary</strong></p>
            <p>This customer is available for challan creation and dispatch planning.</p>
          </div>
        )}
        {activeTab === 'challans' && <p>Past challans for this customer will appear here once they are created.</p>}
        {activeTab === 'invoices' && <p>Invoice history can be attached here in a later phase.</p>}
        {activeTab === 'activity' && <p>Recent activity and notes will be shown here in a later phase.</p>}
      </div>
    </main>
  )
}
