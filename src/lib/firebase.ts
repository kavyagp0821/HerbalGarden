// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This is a critical check to ensure the environment variables are loaded.
if (!firebaseConfig.apiKey) {
  console.error('--------------------------------------------------');
  console.error('🔴 FIREBASE API KEY IS MISSING!');
  console.error('Please make sure all NEXT_PUBLIC_FIREBASE_ variables are set in your .env file.');
  console.error('You need to restart the server after updating the .env file.');
  console.error('--------------------------------------------------');
}


// Initialize Firebase for client-side
let app: FirebaseApp;
let auth: Auth;

// This check ensures we only initialize Firebase on the client-side.
if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (e) {
    console.error("Failed to initialize Firebase", e);
  }
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
}

// @ts-ignore
export { app, auth };