// Contexto de autenticación: expone el usuario actual y las funciones
// de registro, inicio y cierre de sesión a toda la app.
import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { auth, firebaseConfigured } from '../firebase/config'

const AuthContext = createContext(null)

// Convierte el objeto User de Firebase en un objeto plano para que React
// detecte los cambios y vuelva a renderizar.
function snapshot(user) {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified, // RF02: estado de verificación de cuenta
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false)
      return
    }
    // Escucha en tiempo real los cambios de sesión (login / logout).
    // El usuario incluye un token de acceso JWT que Firebase valida en cada
    // operación con Firestore (RF03).
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(snapshot(u))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // RF01: registrar un nuevo usuario con correo y contraseña.
  async function register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    // RF02: enviar correo automático con enlace único de verificación.
    await sendEmailVerification(cred.user)
    setUser(snapshot(auth.currentUser))
    return cred.user
  }

  // RF03: iniciar sesión (Firebase emite/valida el token JWT).
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // RF03: cerrar sesión (destruye el token de acceso del cliente).
  function logout() {
    return signOut(auth)
  }

  // Reenvía el correo de verificación.
  function resendVerification() {
    return sendEmailVerification(auth.currentUser)
  }

  // Vuelve a consultar el estado del usuario (para detectar si ya verificó).
  async function reloadUser() {
    await auth.currentUser.reload()
    setUser(snapshot(auth.currentUser))
    return auth.currentUser.emailVerified
  }

  // Refresca el usuario en memoria (tras editar el nombre).
  function refreshUser() {
    setUser(snapshot(auth.currentUser))
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    resendVerification,
    reloadUser,
    refreshUser,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para consumir el contexto desde cualquier componente.
export function useAuth() {
  return useContext(AuthContext)
}
