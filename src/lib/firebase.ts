// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if all necessary Firebase credentials are provided in the environment.
const areFirebaseCredsAvailable = 
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

if (areFirebaseCredsAvailable) {
  // Initialize Firebase only if it hasn't been initialized yet
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // If credentials are not available, use mock objects and log a warning.
  // This prevents the application from crashing, especially during build or on the server.
  console.warn("Firebase credentials are not fully configured. Using mock services.");
  app = {} as any; // Using `any` to mock the FirebaseApp type
  auth = {} as any;
  db = {} as any;
}

// These are mock functions to be used when Firebase is not configured.
// They prevent runtime errors if these functions are called without a proper Firebase setup.
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
