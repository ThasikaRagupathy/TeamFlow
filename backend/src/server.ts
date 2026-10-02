import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/db';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB/database first
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('🏠 TaskFlow Backend Server');
      console.log('========================================');
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log(`📡 API:    http://localhost:${PORT}/api`);
      console.log('========================================');
      console.log('');
    });
  } catch (error) {
    console.error('');
    console.error('❌ Failed to start TaskFlow server');
    console.error(error);
    console.error('');

    process.exit(1);
  }
};

startServer();