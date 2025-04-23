import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'pino-http';

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
app.use(logger())

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    data: {
      message: 'Welcome to Artisyn API',
      version: '1.0.0',
    },
    status: 'success',
    message: 'OK',
    code: 200,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
