'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('WAREHOUSE_MANAGER')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const session = { name: name || email, email, role }
    localStorage.setItem('paras-auth', JSON.stringify(session))
    setMessage('Signed in successfully')
    router.replace('/')
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h2>Warehouse Sign In</h2>
      <p>Use this demo sign-in to access the inventory workflows.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="SALES">Sales</option>
          <option value="READ_ONLY">Read Only</option>
        </select>
        <button type="submit">Continue</button>
      </form>
      {message ? <p>{message}</p> : null}
    </main>
  )
}
