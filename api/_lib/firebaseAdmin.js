// Verificación de tokens de Firebase en el backend (CommonJS para Vercel).
// El frontend envía el ID Token (JWT) en el encabezado Authorization.
const { getApps, initializeApp, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

let ready = false

// Inicializa firebase-admin la primera vez que se necesita (lazy).
function ensureInit() {
  if (ready) return
  if (!getApps().length) {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
      process.env
    if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      throw new Error(
        'Faltan credenciales del backend: define FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY (cuenta de servicio de Firebase).',
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
async function getUidFromRequest(req) {
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

module.exports = { getUidFromRequest }
