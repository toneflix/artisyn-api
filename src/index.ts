import 'module-alias/register'
import 'src/utils/prototypes'

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { env } from './utils/helpers';
import express from 'express';
import { getRateLimiter } from './middleware/rateLimiter';
import { securityHeaders } from './middleware/securityHeaders';
import { ipBlocker } from './middleware/ipBlocker';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import { securityLogger } from './middleware/securityLogger';
import { abuseMonitor } from './middleware/monitoring';
import { initialize } from './utils/initialize';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
// Security & monitoring middleware
app.use(securityHeaders);
app.use(ipBlocker);
app.use(securityLogger);
app.use(abuseMonitor);
// Example: Apply rate limiting globally (customize per route as needed)
app.use(getRateLimiter('guest'));
const port = env('PORT', 3000);

// Initialize Prisma client
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'public')));
// Example: Protect API routes with API key (customize as needed)
// app.use('/api/external', apiKeyAuth);

initialize(app)

// Start server
app.listen(port, () => {
  if (env('NODE_ENV') !== 'test') {
    console.log(`Server running on port ${port}`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
