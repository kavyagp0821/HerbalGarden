// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;

// --- DEBUGGING LOG ---
// The following log is for debugging database connection issues.
// It prints the URI being used, but masks the password for security.
if (uri) {
  console.log('Attempting to connect to MongoDB with URI:', uri.replace(/:([^:]*)@/, ':****@'));
} else {
  console.error('CRITICAL: MONGODB_URI environment variable is not defined!');
}
// --- END DEBUGGING LOG ---


if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
// In production mode, it's best to not use a global variable.
if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
