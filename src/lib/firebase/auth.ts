
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendEmailVerification,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

export const signUpWithEmail = async (email: string, password: string): Promise<{ user?: User; error?: AuthError }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    return { user: userCredential.user };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user?: User; error?: AuthError }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const signOutUser = async (): Promise<{ error?: AuthError }> => {
  try {
    await signOut(auth);
    return {};
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const sendPasswordReset = async (email: string): Promise<{ error?: AuthError }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const onAuthStateChangedWrapper = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
