// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCk1Jn3LFYboe7MIuOtjtpwcK-e-WI4AbY",
  authDomain: "modulo5-e35d6.firebaseapp.com",
  projectId: "modulo5-e35d6",
  storageBucket: "modulo5-e35d6.firebasestorage.app",
  messagingSenderId: "740621882355",
  appId: "1:740621882355:web:e133f7ca7c47426e17f886"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;