import mongoose from 'mongoose';

export const connectDatabase = async (
  uriOverride?: string
): Promise<string> => {
  const mongoUri = uriOverride || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGODB_URI is not defined. Please add your MongoDB connection string to the .env file.'
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('========================================');
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log('========================================');

    return mongoUri;
  } catch (error) {
    console.error('========================================');
    console.error('❌ MongoDB connection failed');
    console.error('========================================');
    console.error(error);

    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB disconnected');
};