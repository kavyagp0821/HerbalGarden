// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
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
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase credentials are not fully configured. Authentication and database services will not be available. Please check your .env file.");
  // Use mock objects to prevent app from crashing if firebase calls are made without config
  app = {} as any; 
  auth = {
      onAuthStateChanged: () => {
          console.warn("Firebase not configured, auth state will not be monitored.");
          return () => {}; // Return an empty unsubscribe function
      }
  } as any;
  db = {} as any;
}

const firebaseSignIn = async (email: string, password: string) => {
    if (!areFirebaseCredsAvailable) throw { code: 'auth/unconfigured' };
    return await signInWithEmailAndPassword(auth, email, password);
};

const firebaseSignInWithGoogle = async () => {
    if (!areFirebaseCredsAvailable) throw { code: 'auth/unconfigured' };
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

const firebaseSignOut = async () => {
    if (!areFirebaseCredsAvailable) return Promise.resolve();
    return await signOut(auth);
};

export { 
    app,
    auth, 
    db, 
    firebaseSignIn, 
    firebaseSignInWithGoogle, 
    firebaseSignOut,
    onAuthStateChanged
};
