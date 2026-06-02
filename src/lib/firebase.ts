import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Keys
const firebaseConfig = {
  apiKey: "AIzaSyB_kDZNl24bNHRy89whrnFyTmdpk96jZDY",
  authDomain: "www.mirhaoficial.com",
  projectId: "mirhashop",
  storageBucket: "mirhashop.appspot.com",
  messagingSenderId: "1074360309995",
  appId: "1:1074360309995:web:xxxxxxxxxxxxxx"
};

// 2. Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
