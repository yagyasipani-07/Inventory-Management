'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Session = {
  name: string
  email: string
  role: string
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('paras-auth')
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        setSession(null)
      }
    } else if (pathname !== '/login') {
      router.replace('/login')
    }
    setReady(true)
  }, [pathname, router])

  if (!ready) return null

  if (!session && pathname !== '/login') {
    return (
      <main style={{ padding: 24 }}>
        <h2>Access required</h2>
        <p>Please sign in to use the warehouse portal.</p>
        <Link href="/login">Go to login</Link>
      </main>
    )
  }

  return <>{children}</>
}
