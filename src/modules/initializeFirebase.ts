import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBkfUTPMnUP7tFz7dQmLRbs8-xjskMJZ5M",
    authDomain: "teyvatdle-api.firebaseapp.com",
    projectId: "teyvatdle-api",
    storageBucket: "teyvatdle-api.firebasestorage.app",
    messagingSenderId: "409440288658",
    appId: "1:409440288658:web:863975c5b015cf3dfc8b4b",
    measurementId: "G-D1CF1GCZZ6",
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage();
  return storage;
}
