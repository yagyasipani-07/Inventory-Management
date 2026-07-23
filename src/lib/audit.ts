import { prisma } from './prisma'

export async function logAudit(params: {
  userId?: string | null
  entityType: string
  entityId: string
  action: string
  oldValue?: any
  newValue?: any
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId ?? undefined,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      oldValue: params.oldValue ?? undefined,
      newValue: params.newValue ?? undefined,
    },
  })
}
