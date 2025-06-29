// src/middleware/ipBlocker.ts
import { Request, Response, NextFunction } from 'express';

// In-memory blocklist (replace with persistent store in production)
const blockedIPs = new Set<string>();

export function blockIP(ip: string) {
  blockedIPs.add(ip);
}

export function unblockIP(ip: string) {
  blockedIPs.delete(ip);
}

import { RequestHandler } from 'express';
export const ipBlocker: RequestHandler = (req, res, next) => {
  const ip = req.ip || '';
  if (blockedIPs.has(ip)) {
    res.status(403).json({ error: 'Your IP has been blocked due to abusive behavior.' });
    return;
  }
  next();
};
