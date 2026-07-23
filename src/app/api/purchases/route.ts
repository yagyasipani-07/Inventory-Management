import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createFallbackPurchase, getFallbackPurchases } from '@/src/lib/fallbackStore'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(purchases)
  } catch {
    return NextResponse.json(getFallbackPurchases(), { status: 200 })
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
      include: { supplier: true },
    })
    return NextResponse.json(purchase, { status: 201 })
  } catch {
    return NextResponse.json(createFallbackPurchase({ purchaseNumber: body?.purchaseNumber ?? null, supplierId: body?.supplierId ?? null }), { status: 201 })
  }
}
