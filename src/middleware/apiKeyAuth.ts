// src/middleware/apiKeyAuth.ts
import { Request, Response, NextFunction } from 'express';

// Example: Replace with secure storage in production
const validApiKeys = new Set<string>([
  process.env.ARTISYN_API_KEY || 'dev-key',
]);

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey || !validApiKeys.has(apiKey)) {
    return res.status(401).json({ error: 'Invalid or missing API key.' });
  }
  next();
}
