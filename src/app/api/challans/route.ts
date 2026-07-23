import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const challans = await prisma.challan.findMany({ orderBy: { createdAt: 'desc' }, include: { customer: true, lineItems: true } })
    return NextResponse.json(challans)
  } catch (error) {
    console.error('Failed to load challans:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lineItems = Array.isArray(body?.lineItems) ? body.lineItems : []
    const totalQty = lineItems.reduce((sum: number, item: any) => sum + Number(item.qty || 0), 0)

    const challan = await prisma.challan.create({
      data: {
        challanNumber: body.challanNumber,
        challanDate: new Date(body.challanDate ?? Date.now()),
        customerId: body.customerId,
        transport: body.transport ?? null,
        status: 'DRAFT',
        totalQty,
        gstPercent: body.gstPercent ?? 0,
        terms: body.terms ?? null,
        checkedBy: body.checkedBy ?? null,
        authorisedBy: body.authorisedBy ?? null,
        createdById: body.createdById ?? 'demo-user',
        lineItems: {
          create: lineItems.map((item: any) => ({
            productId: item.productId,
            qty: Number(item.qty || 0),
            rate: item.rate ?? null,
            amount: item.amount ?? null,
          })),
        },
      },
    })
    return NextResponse.json(challan, { status: 201 })
  } catch (error) {
    console.error('Failed to create challan:', error)
    return NextResponse.json({ error: 'Unable to create challan' }, { status: 500 })
  }
}
