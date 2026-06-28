// Configuración e inicialización de Firebase (solo Authentication).
// Los DATOS del sistema se guardan en MongoDB Atlas a través del backend (api/).
// Las credenciales se leen del archivo .env (ver .env.example).
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Bandera para saber si el usuario ya llenó las credenciales en .env.
export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let app = null
let auth = null

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app) // Autenticación (emite el token JWT que valida el backend)
}

export { app, auth }
