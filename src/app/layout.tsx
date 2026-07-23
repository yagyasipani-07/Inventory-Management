import Link from 'next/link'
import './globals.css'
import { AuthGate } from './components/AuthGate'

export const metadata = {
  title: 'Paras Plywoods',
  description: 'Inventory management MVP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong>Paras Plywoods</strong>
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/customers">Customers</Link>
          <Link href="/challans">Challans</Link>
          <Link href="/purchases">Purchases</Link>
          <Link href="/suppliers">Suppliers</Link>
          <Link href="/import">Import</Link>
          <Link href="/audit">Audit</Link>
          <Link href="/login">Login</Link>
        </nav>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  )
}
