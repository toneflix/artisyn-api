import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Simple anomaly detection: find users with unusually high activity in a short period
 */
export async function detectAnomalies({ windowMinutes = 10, threshold = 50 } = {}) {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const results = await prisma.activityLog.groupBy({
    by: ['userId'],
    where: { createdAt: { gte: since }, userId: { not: null } },
    _count: { userId: true },
    having: { _count: { userId: { gt: threshold } } },
  });
  return results;
}
