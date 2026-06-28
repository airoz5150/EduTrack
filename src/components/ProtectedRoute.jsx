// Protege rutas privadas: requiere sesión activa y cuenta verificada (RF02).
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner full />
  if (!user) return <Navigate to="/login" replace />
  // Si la cuenta no ha sido verificada por correo, va a la pantalla de verificación.
  if (!user.emailVerified) return <Navigate to="/verify" replace />
  return children
}
