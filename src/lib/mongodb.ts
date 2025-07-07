// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;

// --- DEBUGGING LOG ---
// The following log is for debugging database connection issues.
// It prints the URI being used, but masks the password for security.
if (uri) {
  console.log('Attempting to connect to MongoDB with URI:', uri.replace(/:([^:]*)@/, ':****@'));

  // Check for special characters in the password which can break the URI
  const passwordMatch = uri.match(/mongodb\+srv:\/\/[^:]+:([^@]+)@/);
  if (passwordMatch && passwordMatch[1]) {
      const password = decodeURIComponent(passwordMatch[1]);
      // Regex to test for common URI-breaking characters
      if (/[@:/?#\[\]]/.test(password)) {
          console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
          console.error('CRITICAL: Your MongoDB password likely contains special characters (e.g., @, :, /, ?, #) that are breaking the connection.');
          console.error('SOLUTION: Please change your database password in MongoDB Atlas to use ONLY letters and numbers. This is the most common cause for this type of error.');
          console.error('--- END HINT ---\n\n\n');
      }
  }

} else {
  console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
  console.error('CRITICAL: The MONGODB_URI environment variable is NOT DEFINED in your .env file.');
  console.error('SOLUTION: Please make sure your .env file contains the line: MONGODB_URI="mongodb+srv://..."');
  console.error('--- END HINT ---\n\n\n');
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
