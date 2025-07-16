// src/contexts/auth-context.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User, onAuthStateChanged, Auth, getAuth } from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';

// --- Firebase Configuration ---
// Using the exact configuration provided to ensure connection.
const firebaseConfig = {
  apiKey: "AIzaSyDInxjNSipqOsz9z3A7fpmjm-salHBPjKQ",
  authDomain: "virtual-herbalgarden-by437.firebaseapp.com",
  projectId: "virtual-herbalgarden-by437",
  storageBucket: "virtual-herbalgarden-by437.appspot.com",
  messagingSenderId: "429243165583",
  appId: "1:429243165583:web:14dcf414b0dfef492079fa"
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  getFirebaseAuth: () => Auth;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const unprotectedRoutes = ['/login', '/signup'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only once on the client side
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    setAuthInstance(auth);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isUnprotected = unprotectedRoutes.includes(pathname);
      if (!user && !isUnprotected) {
        router.push('/login');
      } else if (user && isUnprotected) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !authInstance || (!user && !unprotectedRoutes.includes(pathname))) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Leaf className="w-12 h-12 text-primary animate-pulse" />
        </div>
    );
  }

  const getFirebaseAuth = () => {
    if (!authInstance) {
      throw new Error("Firebase Auth has not been initialized on the client yet.");
    }
    return authInstance;
  }

  return (
    <AuthContext.Provider value={{ user, loading, getFirebaseAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
