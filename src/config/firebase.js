import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Configuración temporal de Firebase (reemplaza con tu configuración real)
const firebaseConfig = {
  apiKey: "AIzaSyDummy-Replace-With-Your-Real-Config",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Si quieres usar variables de entorno, descomenta esto:
/*
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID 
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};
*/

console.log("Configuración de Firebase cargada:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  configured: !!firebaseConfig.apiKey
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase inicializado correctamente');

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('Todos los servicios de Firebase inicializados');

// Exportar servicios
export { auth, db, storage };
export default app;