import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rows = Array.isArray(body?.rows) ? body.rows : []
    let created = 0

    for (const row of rows) {
      const productCode = row.productCode ? String(row.productCode).trim() : ''
      if (!productCode) continue

      const qty = row.productQty ? Number(row.productQty) : 0
      const perBox = row.qtyPcsPerBox ? Number(row.qtyPcsPerBox) : null

      const product = await prisma.product.upsert({
        where: { productCode },
        update: {
          mould: row.mould ? String(row.mould) : undefined,
          currentStock: qty ? { increment: qty } : undefined,
          qtyPcsPerBox: perBox || undefined,
        },
        create: {
          productCode,
          mould: row.mould ? String(row.mould) : null,
          productQty: qty || null,
          qtyPcsPerBox: perBox,
          currentStock: qty,
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
  } catch (error) {
    return NextResponse.json({ error: 'Import failed', details: String(error) }, { status: 500 })
  }
}
