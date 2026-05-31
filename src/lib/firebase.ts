import { initializeApp, getApps } from 'firebase/app'; // getApps add this
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Duplicate initialization stop this
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// FIX: databaseId remove, just your pass
export const db = getFirestore(app); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
