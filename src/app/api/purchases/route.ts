import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { supplier: true, lineItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(purchases)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchases', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  try {
    const purchase = await prisma.purchase.create({
      data: {
        purchaseNumber: body?.purchaseNumber ?? null,
        supplierId: body?.supplierId ?? null,
        status: 'PENDING',
      },
      include: { supplier: true, lineItems: { include: { product: true } } },
    })
    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Could not create purchase in database', details: String(error) }, { status: 500 })
  }
}
