import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Failed to load customers:', error)
    return NextResponse.json({ error: 'Failed to load customers', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const customer = await prisma.customer.create({
      data: {
        customerNumber: body.customerNumber,
        name: body.name,
        gst: body.gst ?? null,
        address: body.address ?? null,
        phone: body.phone ?? null,
        city: body.city ?? null,
        preferredTransport: body.preferredTransport ?? null,
      },
    })
    await logAudit({
      entityType: 'Customer',
      entityId: customer.id,
      action: 'CREATED',
      newValue: { name: customer.name },
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Failed to create customer:', error)
    return NextResponse.json({ error: 'Unable to create customer' }, { status: 500 })
  }
}
