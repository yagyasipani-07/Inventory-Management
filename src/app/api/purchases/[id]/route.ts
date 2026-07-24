import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'


export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, lineItems: { include: { product: true } } },
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    return NextResponse.json(purchase)
  } catch {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json().catch(() => null)

  try {
    const { id } = await params;
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { lineItems: true },
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    if (body?.action === 'add-line-item') {
      const { productId, qty, unitCost } = body
      if (!productId || typeof qty !== 'number' || qty <= 0) {
        return NextResponse.json({ error: 'productId and qty are required' }, { status: 400 })
      }

      const lineItem = await prisma.purchaseLineItem.create({
        data: {
          purchaseId: purchase.id,
          productId,
          qty,
          unitCost: typeof unitCost === 'number' ? unitCost : null,
        },
        include: { product: true },
      })

      await logAudit({
        entityType: 'PurchaseLineItem',
        entityId: lineItem.id,
        action: 'CREATED',
        newValue: { purchaseId: purchase.id, productId, qty },
      })

      return NextResponse.json(lineItem, { status: 201 })
    }

    if (body?.action === 'receive') {
      if (purchase.status === 'RECEIVED') {
        return NextResponse.json({ error: 'Purchase already received' }, { status: 400 })
      }

      await prisma.$transaction(async (tx) => {
        for (const item of purchase.lineItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { currentStock: { increment: item.qty } },
          })
        }

        await tx.purchase.update({
          where: { id: purchase.id },
          data: {
            status: 'RECEIVED',
            receivedBy: body.receivedBy ?? 'demo-user',
            receivedTime: new Date(),
          },
        })
      })

      await logAudit({
        entityType: 'Purchase',
        entityId: purchase.id,
        action: 'RECEIVED',
        newValue: { status: 'RECEIVED' },
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update purchase', details: String(error) }, { status: 500 })
  }
}
