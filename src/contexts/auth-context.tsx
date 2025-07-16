// src/contexts/auth-context.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, getAuth, Auth } from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDInxjNSipqOsz9z3A7fpmjm-salHBPjKQ",
  authDomain: "virtual-herbalgarden-by437.firebaseapp.com",
  projectId: "virtual-herbalgarden-by437",
  storageBucket: "virtual-herbalgarden-by437.appspot.com",
  messagingSenderId: "429243165583",
  appId: "1:429243165583:web:14dcf414b0dfef492079fa"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
export const auth = getAuth(app);


interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const unprotectedRoutes = ['/login', '/signup'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

  if (loading || (!user && !unprotectedRoutes.includes(pathname))) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
            <Leaf className="w-12 h-12 text-primary animate-pulse" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
