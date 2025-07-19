// src/contexts/auth-context.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  firebaseSignIn, 
  firebaseSignUp, 
  firebaseSignInWithGoogle, 
  firebaseSendPasswordReset,
  firebaseSignOut
} from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only subscribe if auth is a valid object with functions
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If firebase is not configured, stop loading and treat as logged out.
      setLoading(false);
      setUser(null);
    }
  }, []);

  const signIn = (email: string, pass: string) => {
    return firebaseSignIn(email, pass);
  };

  const signUp = (email: string, pass: string) => {
    return firebaseSignUp(email, pass);
  };
  
  const signInWithGoogle = () => {
    return firebaseSignInWithGoogle();
  };

  const signOut = async () => {
    await firebaseSignOut();
    router.push('/login');
  };

  const sendPasswordReset = (email: string) => {
    return firebaseSendPasswordReset(email);
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
