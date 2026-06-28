// Verificación del token (ID Token / JWT) de Firebase en el backend, SIN
// firebase-admin (que arrastra 'jose' y rompe en Vercel). Validamos la firma
// del token con las llaves públicas de Google. Solo se necesita el PROJECT_ID.
const jwt = require('jsonwebtoken')

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID
const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

// Caché de las llaves públicas de Google (se renuevan ~cada hora).
let cache = { certs: null, exp: 0 }

async function getCerts() {
  const now = Date.now()
  if (cache.certs && now < cache.exp) return cache.certs
  const res = await fetch(CERTS_URL)
  if (!res.ok) throw new Error('No se pudieron obtener las llaves públicas de Google')
  const certs = await res.json()
  cache = { certs, exp: now + 60 * 60 * 1000 }
  return certs
}

// Devuelve el uid si el token es válido (firma + emisor + audiencia), o null.
async function getUidFromRequest(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || !decoded.header || !decoded.header.kid) return null

    const certs = await getCerts()
    const pem = certs[decoded.header.kid]
    if (!pem) return null

    const payload = jwt.verify(token, pem, {
      algorithms: ['RS256'],
      audience: PROJECT_ID,
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    })
    return payload.user_id || payload.sub || null
  } catch {
    return null
  }
}

module.exports = { getUidFromRequest }
