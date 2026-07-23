"use client"

import { useMemo, useState } from 'react'

type ImportRow = {
  productCode: string
  mould: string
  productQty: number | string
  qtyPcsPerBox: number | string
}

export function ImportPreview({ text }: { text: string }) {
  const [rows, setRows] = useState<ImportRow[]>([])

  useMemo(() => {
    const parsed = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split(',')
        return {
          productCode: parts[0] || '',
          mould: parts[1] || '',
          productQty: parts[2] || 0,
          qtyPcsPerBox: parts[3] || 0,
        }
      })
    setRows(parsed)
  }, [text])

  const validRows = rows.filter(row => row.productCode)

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Preview</h3>
      <p>{validRows.length} valid rows ready for import.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Code</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Mould</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Qty</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Per Box</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.productCode}-${idx}`}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.productCode || '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.mould || '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.productQty}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.qtyPcsPerBox}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
