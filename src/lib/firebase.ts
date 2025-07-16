// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDInxjNSipqOsz9z3A7fpmjm-salHBPjKQ",
  authDomain: "virtual-herbalgarden-by437.firebaseapp.com",
  projectId: "virtual-herbalgarden-by437",
  storageBucket: "virtual-herbalgarden-by437.appspot.com",
  messagingSenderId: "429243165583",
  appId: "1:429243165583:web:14dcf414b0dfef492079fa"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
