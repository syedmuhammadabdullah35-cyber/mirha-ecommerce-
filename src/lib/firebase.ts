import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_kDZN124bNHRy89whrnFyTmdpk96jZDY",
  authDomain: "mirhashop.firebaseapp.com",
  projectId: "mirhashop",
  storageBucket: "mirhashop.firebasestorage.app",
  messagingSenderId: "869855032923",
  appId: "1:869855032923:web:4e2a4d126850e6ef5b317e",
  measurementId: "G-RVV6G7FD16"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
