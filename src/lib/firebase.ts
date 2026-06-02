import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Keys
const firebaseConfig = {
  apiKey: "AIzaSyB_kDZNl24bNHRy89whrnFyTmdpk96jZDY",
  authDomain: "mirhashop.firebaseapp.com",
  projectId: "mirhashop",
  storageBucket: "mirhashop.appspot.com",
  messagingSenderId: "869855032923",
  appId: "1:869855032923:web:4e2a4d126850e6ef5b317e"
};
// 2. Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
