import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

require("dotenv").config();
export function initializeFirebase() {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage();
  return storage;
}
