import { MongoClient } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

// Lazy initialization function to avoid checking env vars during build
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

// Export a thenable object that lazily creates the promise when accessed
// This allows the module to be imported during build without throwing errors
const lazyClientPromise = {
  then: (onFulfilled?: (value: MongoClient) => any, onRejected?: (reason: any) => any) => {
    return getClientPromise().then(onFulfilled, onRejected);
  },
  catch: (onRejected?: (reason: any) => any) => {
    return getClientPromise().catch(onRejected);
  },
} as Promise<MongoClient>;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
// The promise is created lazily when first accessed (runtime, not build time)
export default lazyClientPromise;
