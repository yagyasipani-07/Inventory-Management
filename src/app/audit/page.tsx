"use client"

import { useEffect, useState } from 'react'

type AuditLog = {
  id: string
  entityType: string
  entityId: string
  action: string
  timestamp: string
  newValue?: Record<string, unknown> | null
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetch('/api/audit')
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setLogs(Array.isArray(data) ? data : [])
      } catch {
        setLogs([])
      }
    }

    loadLogs()
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h2>Audit Log</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id} style={{ marginBottom: 10 }}>
            <div>{log.timestamp} — {log.entityType} #{log.entityId} — {log.action}</div>
            {log.newValue ? <div style={{ color: '#475569' }}>{JSON.stringify(log.newValue)}</div> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
