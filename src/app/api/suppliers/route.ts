import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.name) {
    return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 })
  }

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: body.name,
        gst: body.gst ?? null,
        address: body.address ?? null,
        phone: body.phone ?? null,
        contactPerson: body.contactPerson ?? null,
      },
    })
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Could not create supplier', details: String(error) }, { status: 500 })
  }
}
