// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

// =================================================================================
// !! IMPORTANT DIAGNOSTIC LOG !!
// This will print the exact MongoDB URI your server is using.
// Please check the server logs for this output to debug connection issues.
console.log('--- MONGODB URI FROM .env ---');
console.log(process.env.MONGODB_URI);
console.log('-----------------------------');
// =================================================================================

const uri = process.env.MONGODB_URI;

if (!uri) {
  // This log is helpful for the user if they forget the .env file
  console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
  console.error('The MONGODB_URI environment variable is not set.');
  console.error('Please create or check the .env file in the root directory and add your connection string.');
  console.error('Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database?retryWrites=true&w=majority');
  console.error('You can get your connection string from MongoDB Atlas under "Connect" > "Drivers".');
  console.error('After adding it, you MUST restart your development server.');
  console.error('--- END HINT ---\n\n\n');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}


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
