// src/lib/firebase.ts
// This file is simplified to prevent authentication/database logic from running.
// If you want to re-enable Firebase, you will need to restore the previous content
// and ensure your .env file is correctly configured.

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Mock Firebase when credentials are not available
const areFirebaseCredsAvailable = firebaseConfig.apiKey && firebaseConfig.projectId;

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

if (areFirebaseCredsAvailable) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Provide mock objects for server-side rendering or when creds are missing
  console.warn("Firebase credentials not found. Using mock Firebase services.");
  app = {} as any;
  auth = {} as any;
  db = {} as any;
}

// Mock functions to prevent errors
const firebaseSignIn = () => Promise.reject(new Error("Firebase is not configured."));
const firebaseSignInWithGoogle = () => Promise.reject(new Error("Firebase is not configured."));
const firebaseSendPasswordReset = () => Promise.reject(new Error("Firebase is not configured."));
const firebaseSignOut = () => Promise.resolve();


export { 
    app,
    auth, 
    db, 
    firebaseSignIn, 
    firebaseSignInWithGoogle, 
    firebaseSendPasswordReset,
    firebaseSignOut,
    onAuthStateChanged
};
