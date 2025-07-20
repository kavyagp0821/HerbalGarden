// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  signOut, 
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

// Initialize Firebase
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let googleProvider: GoogleAuthProvider;

const areFirebaseCredsAvailable = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

if (areFirebaseCredsAvailable) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else {
  if (typeof window !== 'undefined') {
    console.warn("Firebase credentials are not available. Firebase services will be disabled on the client.");
  }
  // Provide mock objects for server-side rendering or when creds are missing
  auth = {} as any;
  db = {} as any;
  googleProvider = {} as any;
}

// Email/Password Sign-up
const firebaseSignUp = (email: string, password: string) => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email/Password Sign-in
const firebaseSignIn = (email: string, password: string) => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-in
const firebaseSignInWithGoogle = () => {
  if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
  return signInWithPopup(auth, googleProvider);
};

// Password Reset
const firebaseSendPasswordReset = (email: string) => {
    if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
    return sendPasswordResetEmail(auth, email);
}

// Sign out
const firebaseSignOut = () => {
    if (!areFirebaseCredsAvailable) return Promise.reject(new Error("Firebase not configured."));
    return signOut(auth);
}

export { 
    auth, 
    db, 
    firebaseSignUp, 
    firebaseSignIn, 
    firebaseSignInWithGoogle, 
    firebaseSendPasswordReset,
    firebaseSignOut,
    onAuthStateChanged
};
