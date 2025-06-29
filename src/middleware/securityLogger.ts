// src/middleware/securityLogger.ts
import { Request, Response, NextFunction } from 'express';

export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log security-relevant events
    if (res.statusCode >= 400) {
      console.warn(`[SECURITY] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${req.ip}`);
    }
  });
  next();
}
