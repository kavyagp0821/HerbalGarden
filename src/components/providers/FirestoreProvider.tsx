// src/components/providers/FirestoreProvider.tsx
'use client';

import { useEffect } from "react";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FirestoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if db object is available (i.e., firebase is configured)
    if (db.app) {
      enableIndexedDbPersistence(db)
        .catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn("Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a a time.");
          } else if (err.code == 'unimplemented') {
            console.warn("Firestore persistence failed: The current browser does not support all of the features required to enable persistence.");
          } else {
            console.warn("Firestore persistence failed with error: ", err);
          }
        });
    }
  }, []);
  
  return children;
}
