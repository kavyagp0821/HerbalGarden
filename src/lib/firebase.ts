// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseConfig } from './env';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase only if the config is valid
if (firebaseConfig) {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    db = getFirestore(app);
}

export { app, db };
