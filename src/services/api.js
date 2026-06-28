// Cliente HTTP del frontend hacia el backend (que guarda en MongoDB).
// Adjunta automáticamente el token JWT de Firebase en cada petición.
import { auth } from '../firebase/config'

// En web/dev usa rutas relativas ('/api', que Vite redirige al backend local
// y en Vercel al mismo dominio). En el APK (Capacitor) se compila con
// VITE_API_URL apuntando al backend en la nube (ej. https://edutrack.vercel.app).
const BASE = (import.meta.env.VITE_API_URL || '') + '/api'

export async function apiFetch(path, { method = 'GET', body } = {}) {
  // Token JWT del usuario autenticado (lo valida el backend).
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null

  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  return res.json()
}
