// src/hooks/use-auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { useAuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const { getFirebaseAuth } = useAuthContext();
  const auth = getFirebaseAuth();

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
