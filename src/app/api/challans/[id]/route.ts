import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { logAudit } from '@/src/lib/audit'

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const challan = await prisma.challan.findUnique({
      where: { id },
      include: { customer: true, lineItems: { include: { product: true } }, createdBy: true, approvedBy: true },
    })
    if (!challan) return NextResponse.json({ error: 'Challan not found' }, { status: 404 })
    return NextResponse.json(challan)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch challan', details: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json()
  const { id } = await params;
  const challan = await prisma.challan.findUnique({ where: { id } })
  if (!challan) return NextResponse.json({ error: 'Challan not found' }, { status: 404 })

  let status = challan.status
  if (body.status) status = body.status

  if (status === 'APPROVED' && challan.status === 'DRAFT') {
    const items = await prisma.challanLineItem.findMany({ where: { challanId: id } })
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { reservedStock: { increment: item.qty } },
      })
    }
  }

  if (status === 'DISPATCHED' && challan.status === 'APPROVED') {
    const items = await prisma.challanLineItem.findMany({ where: { challanId: id } })
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          currentStock: { decrement: item.qty },
          reservedStock: { decrement: item.qty },
        },
      })
    }
  }

  const updated = await prisma.challan.update({
    where: { id },
    data: {
      status,
      approvedAt: body.status === 'APPROVED' ? new Date() : challan.approvedAt,
      dispatchedAt: body.status === 'DISPATCHED' ? new Date() : challan.dispatchedAt,
    },
  })

  await logAudit({
    entityType: 'Challan',
    entityId: updated.id,
    action: status,
    newValue: { challanNumber: updated.challanNumber, status },
  })

  return NextResponse.json(updated)
}
