import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Aggregate activity logs for analytics (e.g., count by action, user, date)
 */
export async function getActivityAnalytics({ from, to }: { from?: string, to?: string }) {
  const where: any = {};
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from);
  if (to) where.createdAt.lte = new Date(to);

  // Example: count by action
  const byAction = await prisma.activityLog.groupBy({
    by: ['action'],
    _count: { action: true },
    where,
    orderBy: { _count: { action: 'desc' } },
  });

  // Example: count by day
  const byDay = await prisma.activityLog.groupBy({
    by: ['createdAt'],
    _count: { createdAt: true },
    where,
  });

  return { byAction, byDay };
}
