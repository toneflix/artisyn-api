// src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';

// Simple abuse detection (extend with real monitoring/alerting tools)
let abuseCount: Record<string, number> = {};
const ABUSE_THRESHOLD = 20; // Example: 20 errors per IP per hour

export function abuseMonitor(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || '';
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      abuseCount[ip] = (abuseCount[ip] || 0) + 1;
      if (abuseCount[ip] > ABUSE_THRESHOLD) {
        // Here you could trigger an alert (email, webhook, etc.)
        console.error(`[ALERT] IP ${ip} exceeded abuse threshold.`);
      }
    }
  });
  next();
}

// Reset abuse counts periodically (e.g., every hour)
setInterval(() => { abuseCount = {}; }, 60 * 60 * 1000);
