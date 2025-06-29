import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Query activity logs with filtering, pagination, and export support.
 * GET /api/activity-logs
 */
export async function getActivityLogs(req: Request, res: Response) {
  const { userId, action, from, to, anonymized, skip = 0, take = 50, exportType } = req.query;
  const where: any = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (anonymized !== undefined) where.anonymized = anonymized === 'true';
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from as string);
  if (to) where.createdAt.lte = new Date(to as string);

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: Number(skip),
    take: Math.min(Number(take), 1000),
  });

  if (exportType === 'csv') {
    // Export as CSV
    const csv = [
      'id,userId,action,targetType,targetId,createdAt,ipAddress,userAgent,anonymized,metadata',
      ...logs.map((l: any) => `"${l.id}","${l.userId}","${l.action}","${l.targetType}","${l.targetId}","${l.createdAt.toISOString()}","${l.ipAddress}","${l.userAgent}",${l.anonymized},"${JSON.stringify(l.metadata)}"`)
    ].join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('activity-logs.csv');
    return res.send(csv);
  }

  res.json({ logs });
}
