import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createFallbackSupplier, getFallbackSuppliers } from '@/src/lib/fallbackStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(suppliers)
  } catch {
    return NextResponse.json(getFallbackSuppliers(), { status: 200 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: body?.name,
        gst: body?.gst ?? null,
        address: body?.address ?? null,
        phone: body?.phone ?? null,
      },
    })
    return NextResponse.json(supplier, { status: 201 })
  } catch {
    return NextResponse.json(createFallbackSupplier({ name: body?.name ?? 'Unnamed supplier' }), { status: 201 })
  }
}
