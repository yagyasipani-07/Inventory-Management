"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Challan = {
  id: string
  challanNumber: string
  status: string
  customer?: { name?: string | null }
}

export default function ChallanDetailPage() {
  const params = useParams<{ id: string }>()
  const [challan, setChallan] = useState<Challan | null>(null)

  async function load() {
    try {
      const res = await fetch('/api/challans')
      const text = await res.text()
      const data = text ? JSON.parse(text) : []
      const found = Array.isArray(data) ? data.find((item: Challan) => item.id === params.id) : null
      setChallan(found ?? null)
    } catch {
      setChallan(null)
    }
  }

  useEffect(() => { load() }, [params.id])

  async function updateStatus(status: string) {
    const res = await fetch(`/api/challans/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (res.ok) load()
  }

  if (!challan) return <main style={{ padding: 24 }}>Loading…</main>

  return (
    <main style={{ padding: 24 }}>
      <h2>{challan.challanNumber}</h2>
      <p>Status: {challan.status}</p>
      <p>Customer: {challan.customer?.name ?? '—'}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => updateStatus('APPROVED')}>Approve</button>
        <button onClick={() => updateStatus('DISPATCHED')}>Dispatch</button>
      </div>
      <p style={{ marginTop: 12, color: '#555' }}>The challan can now be approved or dispatched through the workflow API.</p>
    </main>
  )
}
