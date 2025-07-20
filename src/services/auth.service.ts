// src/services/auth.service.ts
import {
  auth,
  firebaseSignIn,
  firebaseSignOut,
  onAuthStateChanged as onFirebaseAuthStateChanged
} from '@/lib/firebase';
import type { User } from 'firebase/auth';

const getErrorMessage = (error: any): string => {
  if (!error.code) return "An unexpected error occurred. Please try again.";
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in window was closed before completing. Please try again.';
    case 'auth/cancelled-popup-request':
        return 'Multiple sign-in requests were made. Please try again.';
    case 'auth/unconfigured':
      return 'Firebase is not configured correctly. Please check your environment variables.'
    default:
      console.error('Unhandled Auth Error:', error);
      return `An error occurred: ${error.message}`;
  }
};

const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return onFirebaseAuthStateChanged(auth, callback);
};

export const authService = {
  signIn: firebaseSignIn,
  signOut: firebaseSignOut,
  onAuthStateChanged,
  getErrorMessage,
};