// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDInxjNSipqOsz9z3A7fpmjm-salHBPjKQ",
  authDomain: "virtual-herbalgarden-by437.firebaseapp.com",
  projectId: "virtual-herbalgarden-by437",
  storageBucket: "virtual-herbalgarden-by437.firebasestorage.app",
  messagingSenderId: "429243165583",
  appId: "1:429243165583:web:f523c0c2baa33f812079fa"
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

const firebaseSignOut = async () => {
    if (!areFirebaseCredsAvailable) return Promise.resolve();
    return await signOut(auth);
};

export { 
    app,
    auth, 
    db, 
    firebaseSignIn, 
    firebaseSignOut,
    onAuthStateChanged
};