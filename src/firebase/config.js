// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC44SY3md1r0RUc_t-5Ydr1orhHSZS5UX8",
  authDomain: "projectdash-ee60d.firebaseapp.com",
  projectId: "projectdash-ee60d",
  storageBucket: "projectdash-ee60d.appspot.com",
  messagingSenderId: "294283608952",
  appId: "1:294283608952:web:57babe246f3f9da81d7e8d",
  measurementId: "G-TQEBR8B9DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
