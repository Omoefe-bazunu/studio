import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Ensure Analytics is initialized only on the client side where it's supported
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        if (
          firebaseConfig.apiKey &&
          firebaseConfig.authDomain &&
          firebaseConfig.projectId &&
          firebaseConfig.storageBucket &&
          firebaseConfig.messagingSenderId &&
          firebaseConfig.appId &&
          firebaseConfig.measurementId
        ) {
          analytics = getAnalytics(app);
          console.log("Firebase Analytics initialized or re-initialized.");
        } else {
          console.warn(
            "Firebase Analytics not initialized due to missing configuration values. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are set."
          );
        }
      } else {
        console.log("Firebase Analytics is not supported in this environment.");
      }
    })
    .catch((error) => {
      console.error("Error checking Firebase Analytics support:", error);
    });
}

export { app, auth, db, storage, analytics };
