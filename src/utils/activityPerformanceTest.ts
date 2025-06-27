import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function performanceTestActivityLogging(iterations = 1000) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    await prisma.activityLog.create({
      data: {
        userId: null,
        action: 'TEST_ACTION',
        targetType: 'Test',
        targetId: String(i),
        metadata: { test: true, i },
        ipAddress: '127.0.0.1',
        userAgent: 'perf-test',
      },
    });
  }
  const duration = Date.now() - start;
  return { iterations, durationMs: duration, avgMs: duration / iterations };
}
