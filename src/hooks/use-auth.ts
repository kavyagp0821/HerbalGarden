// src/hooks/use-auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  Auth,
} from 'firebase/auth';
import { useAuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const { getFirebaseAuth } = useAuthContext();
  
  const signUp = (email, password) => {
    const auth = getFirebaseAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    const auth = getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signInWithGoogle = () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOut = () => {
    const auth = getFirebaseAuth();
    return firebaseSignOut(auth);
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
