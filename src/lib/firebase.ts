// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDInxjNSipqOsz9z3A7fpmjm-salHBPjKQ",
  authDomain: "virtual-herbalgarden-by437.firebaseapp.com",
  projectId: "virtual-herbalgarden-by437",
  storageBucket: "virtual-herbalgarden-by437.appspot.com",
  messagingSenderId: "429243165583",
  appId: "1:429243165583:web:14dcf414b0dfef492079fa"
};


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
