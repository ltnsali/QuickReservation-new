import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBE6-k6Ry1GAWdwQVeUpAv087q1Nz9BBrc',
  authDomain: 'quick-reservation.firebaseapp.com',
  projectId: 'quick-reservation',
  storageBucket: 'quick-reservation.firebasestorage.app',
  messagingSenderId: '57102764070',
  appId: '1:57102764070:web:0aee488c1c8ddf4f09fee7',
  measurementId: 'G-50TYH4J52P',
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
