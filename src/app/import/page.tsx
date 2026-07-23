"use client"

import { useState, type FormEvent } from 'react'
import { ImportPreview } from '@/src/app/components/ImportPreview'

export default function ImportPage() {
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
    const rows = lines.map(line => ({
      productCode: line.split(',')[0] || '',
      mould: line.split(',')[1] || '',
      productQty: line.split(',')[2] || 0,
      qtyPcsPerBox: line.split(',')[3] || 0,
    }))

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })
      const result = await res.json()
      setMessage(res.ok ? `Imported ${result.created} rows.` : result.error || 'Import failed')
    } catch {
      setMessage('Import failed. Please try again.')
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h2>Import Products</h2>
      <p>Paste CSV-style rows: productCode,mould,productQty,qtyPcsPerBox</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <textarea rows={10} value={text} onChange={e => setText(e.target.value)} placeholder="ABC-001,Sample Mould,10,20" />
        <button type="submit">Import</button>
      </form>
      <ImportPreview text={text} />
      {message ? <p>{message}</p> : null}
    </main>
  )
}
