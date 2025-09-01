import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgsdz1h5YtMntYH21qtRsrLUzQspOaVN0",
  authDomain: "practica-firebase-20230083.firebaseapp.com",
  projectId: "practica-firebase-20230083",
  storageBucket: "practica-firebase-20230083.firebasestorage.app",
  messagingSenderId: "444889248250",
  appId: "1:444889248250:web:2deb2fb58b31beb7a7b443"
};

console.log("Valor de configuracion", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getFirestore (app);

const storage = getStorage(app);

export { database, storage };