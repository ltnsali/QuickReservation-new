import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXzlcXOFoELS6Cup9ks2OlP01trBz1d48",
  authDomain: "my-quick-reservation.firebaseapp.com",
  projectId: "my-quick-reservation",
  storageBucket: "my-quick-reservation.firebasestorage.app",
  messagingSenderId: "428885648882",
  appId: "1:428885648882:web:a2f25b9157021333eeb76b",
  measurementId: "G-Y2D10DTRL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics only in client-side environment
let analytics = null;
if (typeof window !== 'undefined') {
  const { getAnalytics } = require('firebase/analytics');
  analytics = getAnalytics(app);
}

// Initialize Storage
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
