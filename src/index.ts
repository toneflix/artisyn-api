import 'module-alias/register'

import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'pino-http';
import routes from './routes/index';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(routes);
if (process.env.NODE_ENV !== 'test') {
  app.use(logger())
}

// Start server
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${port}`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
