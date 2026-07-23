import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 20 })
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to load audit logs:', error)
    return NextResponse.json([], { status: 200 })
  }
}
