// src/lib/env.ts
export function getFirebaseConfig() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Check if any of the essential firebase config values are missing or are placeholders
  const isConfigIncomplete = Object.values(firebaseConfig).some(
    (value) => !value || value.startsWith('YOUR_')
  );

  if (isConfigIncomplete) {
    console.warn("Firebase config is not provided. Optional Firebase services like Auth will not be available.");
    return null; // Return null if the config is not complete
  }

  return firebaseConfig;
}
