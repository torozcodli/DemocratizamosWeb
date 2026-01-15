import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Validar MONGODB_URI solo cuando se intenta conectar (runtime, no build time)
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    const error = new Error('Please define the MONGODB_URI environment variable inside .env.local');
    console.error('[connectDB] MONGODB_URI is not defined');
    throw error;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((error) => {
      console.error('[connectDB] Failed to connect to MongoDB:', error.message);
      cached.promise = null;
      throw error;
    }) as any;
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('[connectDB] Error awaiting connection:', error.message);
    throw error;
  }

  return cached.conn;
}

export default connectDB;
