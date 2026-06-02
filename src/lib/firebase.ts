import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Keys
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_kDZNl24bNHRy89whrnFyTmdpk96jZDY",
  authDomain: "mirhashop.firebaseapp.com",
  projectId: "mirhashop",
  storageBucket: "mirhashop.firebasestorage.app",
  messagingSenderId: "869855032923",
  appId: "1:869855032923:web:4e2a4d126850e6ef5b317e",
  measurementId: "G-RVV6G7FD16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// 2. Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
