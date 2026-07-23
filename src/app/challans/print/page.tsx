"use client"

import { useEffect, useState } from 'react'
import { ChallanTemplate } from '@/src/app/components/ChallanTemplate'

type Challan = {
  id: string
  challanNumber: string
  status: string
  customer?: { name?: string | null }
  lineItems?: Array<{ product?: { productCode?: string | null } | null; qty?: number | null; rate?: number | null }>
}

export default function ChallanPrintPage() {
  const [challans, setChallans] = useState<Challan[]>([])

  useEffect(() => {
    const loadChallans = async () => {
      try {
        const res = await fetch('/api/challans')
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setChallans(Array.isArray(data) ? data : [])
      } catch {
        setChallans([])
      }
    }

    loadChallans()
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h2>Print Challan</h2>
      {challans.map(ch => (
        <div key={ch.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
          <strong>{ch.challanNumber}</strong>
          <p>Status: {ch.status}</p>
          <ChallanTemplate
            challanNumber={ch.challanNumber}
            customerName={ch.customer?.name ?? 'Customer'}
            lineItems={(ch.lineItems || []).map(item => ({
              productCode: item.product?.productCode ?? 'Item',
              qty: item.qty ?? 0,
              rate: item.rate ?? 0,
            }))}
          />
          <button onClick={() => window.print()} style={{ marginTop: 12 }}>Print</button>
        </div>
      ))}
    </main>
  )
}
