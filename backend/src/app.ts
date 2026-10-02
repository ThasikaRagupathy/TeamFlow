import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import commentRoutes from './routes/commentRoutes';

import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

/* =========================================================
   SECURITY
========================================================= */

app.use(helmet());

/* =========================================================
   CORS
========================================================= */

// Frontend URLs allowed to access the backend
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5175',
  'http://localhost:5175',
  'http://127.0.0.1:5175',

  // Keep these if you sometimes run the frontend on port 3000
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, curl, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PATCH',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

/* =========================================================
   LOGGING
========================================================= */

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

/* =========================================================
   RATE LIMITING
========================================================= */

app.use('/api', apiRateLimiter);

/* =========================================================
   ROOT ROUTE
========================================================= */

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Taskflow API is running',
    status: 'ok',
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'TaskFlow backend is healthy',
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

// Authentication
app.use('/api/auth', authRoutes);

// Projects
app.use('/api/projects', projectRoutes);

// Tasks
app.use('/api/tasks', taskRoutes);

// Comments
app.use('/api/comments', commentRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);

/* =========================================================
   EXPORT APP
========================================================= */

export default app;