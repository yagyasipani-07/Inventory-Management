"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Purchase = {
  id: string
  purchaseNumber?: string | null
  status?: string | null
  supplier?: { name?: string | null } | null
  lineItems?: Array<{ id: string; qty?: number | null; product?: { productCode?: string | null } | null }>
}

export default function PurchaseDetailPage() {
  const params = useParams<{ id: string }>()
  const [purchase, setPurchase] = useState<Purchase | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/purchases/${params.id}`)
      const data = await res.json()
      setPurchase(data)
    }
    if (params.id) {
      load()
    }
  }, [params.id])

  if (!purchase) return <main style={{ padding: 24 }}>Loading…</main>

  return (
    <main style={{ padding: 24 }}>
      <h2>Purchase details</h2>
      <p><strong>Number:</strong> {purchase.purchaseNumber ?? '—'}</p>
      <p><strong>Status:</strong> {purchase.status ?? 'PENDING'}</p>
      <p><strong>Supplier:</strong> {purchase.supplier?.name ?? '—'}</p>
      <h3>Line items</h3>
      <ul>
        {(purchase.lineItems ?? []).map((item) => (
          <li key={item.id}>
            {item.product?.productCode ?? 'SKU'} × {item.qty ?? 0}
          </li>
        ))}
      </ul>
    </main>
  )
}
