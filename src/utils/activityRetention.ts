import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Anonymize or delete logs older than retention period (e.g., 90 days)
 * Run as a scheduled job or via admin endpoint
 */
export async function enforceLogRetention(retentionDays = 90) {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  // Anonymize logs older than cutoff
  await prisma.activityLog.updateMany({
    where: { createdAt: { lt: cutoff }, anonymized: false },
    data: {
      userId: null,
      ipAddress: null,
      userAgent: null,
      anonymized: true,
    },
  });
  // Optionally, delete logs much older (e.g., 1 year)
  const deleteCutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  await prisma.activityLog.deleteMany({
    where: { createdAt: { lt: deleteCutoff } },
  });
}
