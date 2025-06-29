// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Example: Tiered limits (could be loaded from config/db)
const tiers = {
  guest: { windowMs: 15 * 60 * 1000, max: 30 }, // 30 req/15min
  user: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 req/15min
  admin: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 req/15min
};

export function getRateLimiter(role: 'guest' | 'user' | 'admin' = 'guest') {
  return rateLimit({
    windowMs: tiers[role].windowMs,
    max: tiers[role].max,
    keyGenerator: (req: Request) => req.ip || '',
    handler: (req: Request, res: Response) => {
      res.status(429).json({ error: 'Too many requests, please try again later.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
