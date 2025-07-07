// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('\n\n❌ MONGODB_URI is not defined. Please check your .env file.\n');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Mask password in debug log
console.log('✅ Connecting to MongoDB at:', uri.replace(/:\/\/(.*):(.*)@/, '://$1:****@'));

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Reuse the client in development to avoid hot-reload connection issues
declare global {
  // Allow global to have a MongoDB client promise in dev mode
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // Always create a new client in production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
