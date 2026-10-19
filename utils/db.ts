import mongoose from 'mongoose';

export const DB_NAME = process.env.MONGODB_DB || 'fitvibe';

declare global {
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

globalThis.mongooseCache = globalThis.mongooseCache || { conn: null, promise: null };

async function connectDB(): Promise<mongoose.Connection> {
  if (globalThis.mongooseCache.conn) {
    return globalThis.mongooseCache.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (!globalThis.mongooseCache.promise) {
    globalThis.mongooseCache.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        dbName: DB_NAME,
        serverSelectionTimeoutMS: 10000,
      })
      .then((instance) => instance.connection)
      .catch((error) => {
        globalThis.mongooseCache.promise = null;
        console.error('MongoDB connection error:', error instanceof Error ? error.message : error);
        throw new Error('Database connection failed');
      });
  }

  globalThis.mongooseCache.conn = await globalThis.mongooseCache.promise;
  return globalThis.mongooseCache.conn;
}

export default connectDB;
