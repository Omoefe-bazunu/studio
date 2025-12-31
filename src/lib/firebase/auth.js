import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Creates a user, updates their profile name, and saves metadata to Firestore.
 */
export const signUpWithEmail = async (email, password, name) => {
  try {
    // 1. Create Auth Credentials
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      // 2. Set the Display Name in Firebase Auth
      await updateProfile(user, { displayName: name });

      // 3. Create the searchable record in Firestore 'users'
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp(),
        isAdmin: user.email === "raniem57@gmail.com",
        status: "active",
      });

      // 4. Send verification email
      await sendEmailVerification(user);
    }

    return { user, error: null };
  } catch (error) {
    console.error("Sign-up Error:", error);
    return { user: null, error };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: { message: error.message || "Logout failed" } };
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const onAuthStateChangedWrapper = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
