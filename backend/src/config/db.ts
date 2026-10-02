import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export const connectDatabase = async (uriOverride?: string): Promise<string> => {
  const envUri = uriOverride || process.env.MONGODB_URI;

  // If explicit URI is provided, attempt connection
  if (envUri && !envUri.includes('memory')) {
    try {
      await mongoose.connect(envUri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`[MongoDB] Connected to database at ${envUri}`);
      return envUri;
    } catch (err) {
      console.warn(`[MongoDB] Could not connect to external MongoDB at ${envUri}. Falling back to embedded MongoMemoryServer...`);
    }
  }

  // Fallback to MongoMemoryServer for standalone zero-dependency execution
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log(`[MongoDB] Connected to in-memory database at ${memoryUri}`);
  return memoryUri;
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
