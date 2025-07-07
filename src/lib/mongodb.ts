// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

// --- TEMPORARY DEBUGGING STEP ---
// The connection URI is hardcoded here to bypass any potential issues with
// loading environment variables from the .env file.
// If this works, it confirms the problem is with how the environment is configured.
// This is NOT a permanent solution and will be removed once the issue is diagnosed.
const uri = "mongodb+srv://plantadmin:MyPassword@cluster0.6xqbguf.mongodb.net/herbal_garden?retryWrites=true&w=majority";

// const uri = process.env.MONGODB_URI;

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
