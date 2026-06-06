import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Critical Environment Variable Check
const requiredEnv = ['MONGODB_URI', 'GEMINI_API_KEY', 'JWT_SECRET'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Environment variable ${env} is missing.`);
    process.exit(1);
  }
});

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Restrict to client URL
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Body limit to prevent large payload attacks
app.use(limiter);
app.use(compression());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', seoRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
