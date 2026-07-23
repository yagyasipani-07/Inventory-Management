import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [productCount, customerCount, challanCount] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.challan.count(),
    ])

    return { productCount, customerCount, challanCount }
  } catch {
    return { productCount: 0, customerCount: 0, challanCount: 0 }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main style={{ padding: 24 }}>
      <h1>Paras Plywoods — Inventory Dashboard</h1>
      <p>Warehouse-first workflow for stock tracking, customer dispatches, challan approvals, and audit visibility.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#f9fafb' }}>
          <strong>Products</strong>
          <div style={{ fontSize: 24, marginTop: 8 }}>{stats.productCount}</div>
          <div style={{ color: '#666', marginTop: 6 }}>Stock entries and import-ready items</div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#f9fafb' }}>
          <strong>Customers</strong>
          <div style={{ fontSize: 24, marginTop: 8 }}>{stats.customerCount}</div>
          <div style={{ color: '#666', marginTop: 6 }}>Dispatch and invoice targets</div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#f9fafb' }}>
          <strong>Challans</strong>
          <div style={{ fontSize: 24, marginTop: 8 }}>{stats.challanCount}</div>
          <div style={{ color: '#666', marginTop: 6 }}>Approve, print, and dispatch</div>
        </div>
      </div>

      <div style={{ marginTop: 24, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#ffffff' }}>
        <strong>Warehouse summary</strong>
        <p style={{ margin: '8px 0 0', color: '#475569' }}>Use the products, customer, and challan pages to keep receiving, dispatch, and approvals in sync with the live stock state.</p>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/products" style={{ textDecoration: 'none', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6 }}>Go to Products</Link>
        <Link href="/customers" style={{ textDecoration: 'none', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6 }}>Go to Customers</Link>
        <Link href="/challans" style={{ textDecoration: 'none', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6 }}>Go to Challans</Link>
        <Link href="/purchases" style={{ textDecoration: 'none', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6 }}>Go to Purchases</Link>
        <Link href="/suppliers" style={{ textDecoration: 'none', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 6 }}>Go to Suppliers</Link>
      </div>
    </main>
  )
}
