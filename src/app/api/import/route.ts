import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json()
  const rows = Array.isArray(body?.rows) ? body.rows : []
  let created = 0

  for (const row of rows) {
    const productCode = row.productCode ?? `AUTO-${Math.random().toString(36).slice(2, 8)}`
    const product = await prisma.product.create({
      data: {
        productCode,
        mould: row.mould ?? null,
        productQty: row.productQty ? Number(row.productQty) : null,
        qtyPcsPerBox: row.qtyPcsPerBox ? Number(row.qtyPcsPerBox) : null,
        currentStock: row.productQty ? Number(row.productQty) : 0,
      },
    })
    created += 1
    await logAudit({
      entityType: 'Product',
      entityId: product.id,
      action: 'IMPORTED',
      newValue: { productCode, currentStock: product.currentStock },
    })
  }

  return NextResponse.json({ created })
}
