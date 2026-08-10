import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import researchRouter from './routes/research.js';
import reportsRouter from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/research', researchRouter);
app.use('/api/reports', reportsRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Autonomous Multi-Agent Research API',
    timestamp: new Date().toISOString(),
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Autonomous Multi-Agent Research Assistant Engine',
    version: '1.0.0',
    endpoints: {
      stream: 'GET /api/research/stream?topic=...&depth=deep',
      reports: 'GET /api/reports',
      health: 'GET /health',
    },
  });
});

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  🚀 Autonomous Agent Server running on port ${PORT}`);
    console.log(`  📡 SSE Endpoint: http://localhost:${PORT}/api/research/stream`);
    console.log(`=======================================================`);
  });
});
