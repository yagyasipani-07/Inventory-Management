import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: 'Database unavailable', details: String(err) }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productCode, mould, productQty, qtyPcsPerBox } = body
    if (!productCode) return NextResponse.json({ error: 'productCode required' }, { status: 400 })

    const product = await prisma.product.create({
      data: {
        productCode,
        mould: mould ?? null,
        productQty: typeof productQty === 'number' ? productQty : null,
        qtyPcsPerBox: typeof qtyPcsPerBox === 'number' ? qtyPcsPerBox : null,
        currentStock: typeof productQty === 'number' ? productQty : 0,
      },
    })

    await logAudit({
      entityType: 'Product',
      entityId: product.id,
      action: 'CREATED',
      newValue: { productCode, currentStock: product.currentStock },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'server error', details: String(err) }, { status: 500 })
  }
}
