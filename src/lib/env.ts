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

  const missingVars = Object.entries(firebaseConfig)
    .filter(([, value]) => !value || value.startsWith('YOUR_'))
    .map(([key]) => `NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

  if (missingVars.length > 0) {
     console.error('🔴🔴🔴 Firebase configuration is missing! 🔴🔴🔴');
     console.error('The application cannot connect to the database.');
     console.error('Please complete the following steps:');
     console.error('1. Find the file named .env in your project\'s root directory.');
     console.error('2. Copy the contents of the .env.example file into your .env file.');
     console.error('3. Get your project credentials from your Firebase project settings.');
     console.error('4. Replace the placeholder values (like YOUR_API_KEY) in .env with your actual credentials.');
     console.error('Missing variables:', missingVars.join(', '));
     console.error('5. IMPORTANT: You MUST restart the development server after editing the .env file.');
     // We throw an error to prevent the app from running with invalid config.
     throw new Error('Firebase configuration is incomplete. Check the server console for instructions.');
  }

  return firebaseConfig;
}
