import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

/**
 * Activity Logging Middleware
 * Logs user actions for security, analytics, and auditing.
 */
export async function activityLogger(req: Request, res: Response, next: NextFunction) {
  // Call next() first to allow the request to complete, then log
  res.on('finish', async () => {
    try {
      // Only log for authenticated users or important endpoints
      const userId = req.user?.id || null;
      const action = req.method + ' ' + req.path;
      const targetType = req.baseUrl.split('/')[1] || null;
      const targetId = req.params.id || null;
      const metadata = {
        query: req.query,
        body: req.body,
        statusCode: res.statusCode,
      };
      await prisma.activityLog.create({
        data: {
          userId,
          action,
          targetType,
          targetId,
          metadata,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || null,
        },
      });
    } catch (err) {
      // Fail silently
    }
  });
  next();
}
