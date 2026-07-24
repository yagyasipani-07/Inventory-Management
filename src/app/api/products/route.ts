import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: 'Database unavailable', details: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productCode, mould, productQty, qtyPcsPerBox, adjustment, reason } = body
    if (!productCode) return NextResponse.json({ error: 'productCode required' }, { status: 400 })

    const initialQty = typeof productQty === 'number' ? productQty : 0
    const adjVal = typeof adjustment === 'number' ? adjustment : 0
    const finalStock = initialQty + adjVal

    const product = await prisma.product.upsert({
      where: { productCode },
      update: {
        mould: mould ?? undefined,
        qtyPcsPerBox: typeof qtyPcsPerBox === 'number' ? qtyPcsPerBox : undefined,
        currentStock: adjVal !== 0 ? { increment: adjVal } : undefined,
      },
      create: {
        productCode,
        mould: mould ?? null,
        productQty: typeof productQty === 'number' ? productQty : null,
        qtyPcsPerBox: typeof qtyPcsPerBox === 'number' ? qtyPcsPerBox : null,
        currentStock: finalStock,
      },
    })

    await logAudit({
      entityType: 'Product',
      entityId: product.id,
      action: adjVal !== 0 ? 'ADJUSTED' : 'CREATED',
      newValue: { productCode, currentStock: product.currentStock, adjustment: adjVal, reason: reason ?? null },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'server error', details: String(err) }, { status: 500 })
  }
}
