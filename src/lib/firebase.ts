// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp;

// Check if all required environment variables are present
const areFirebaseCredsAvailable =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (areFirebaseCredsAvailable) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
} else {
    console.warn("Firebase credentials are not available. Firebase services will be disabled.");
}


// Conditionally initialize Firebase services
const auth = areFirebaseCredsAvailable ? getAuth(app!) : ({} as any);
const db = areFirebaseCredsAvailable ? getFirestore(app!) : ({} as any);
const googleProvider = areFirebaseCredsAvailable ? new GoogleAuthProvider() : ({} as any);

// Email/Password Sign-up
const signUp = (email: string, password: string) => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email/Password Sign-in
const signIn = (email: string, password: string) => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-in
const signInWithGoogle = () => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return signInWithPopup(auth, googleProvider);
};

export { auth, db, signUp, signIn, signInWithGoogle };
