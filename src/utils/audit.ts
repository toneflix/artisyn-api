import { Request } from 'express';
import prisma from '../database/client';

export async function auditLog(action: string, userId: string | number | undefined, meta: any = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId: userId ? String(userId) : null,
        meta: JSON.stringify(meta),
        timestamp: new Date(),
      },
    });
  } catch (e) {
    // Optionally log to console or external service
    console.error('Audit log failed:', e);
  }
}
