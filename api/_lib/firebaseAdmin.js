// Verificación de tokens de Firebase en el backend.
// El frontend envía el ID Token (JWT) de Firebase en el encabezado Authorization;
// aquí lo validamos con firebase-admin usando una cuenta de servicio.
// (Se usan los imports modulares de firebase-admin, requeridos en módulos ES.)
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let ready = false

// Inicializa firebase-admin la primera vez que se necesita (lazy), para que el
// servidor pueda arrancar aunque todavía falte la clave de la cuenta de servicio.
function ensureInit() {
  if (ready) return
  if (!getApps().length) {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
      process.env
    if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      throw new Error(
        'Faltan credenciales del backend: define FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY en .env (genera la clave de cuenta de servicio en Firebase).',
      )
    }
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // Por si la clave llega con '\n' literal, los convertimos a saltos reales.
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  }
  ready = true
}

// Devuelve el uid del usuario si el token es válido, o null si no lo es.
export async function getUidFromRequest(req) {
  ensureInit()
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    const decoded = await getAuth().verifyIdToken(token)
    return decoded.uid
  } catch {
    return null
  }
}
