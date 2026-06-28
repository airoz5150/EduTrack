// Configuración de rutas de la aplicación.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { firebaseConfigured } from './firebase/config'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import SetupNeeded from './pages/SetupNeeded'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Subjects from './pages/Subjects'
import Resources from './pages/Resources'
import Profile from './pages/Profile'

// Evita que un usuario con sesión vea login/registro.
function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return children
}

// Pantalla de verificación: requiere sesión, pero solo si aún NO está verificado.
function VerifyGate({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.emailVerified) return <Navigate to="/" replace />
  return children
}

export default function App() {
  // Si faltan las credenciales de Firebase, mostramos la guía de configuración.
  if (!firebaseConfigured) return <SetupNeeded />

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />
          <Route
            path="/verify"
            element={
              <VerifyGate>
                <VerifyEmail />
              </VerifyGate>
            }
          />

          {/* Rutas privadas: requieren sesión verificada y comparten el Layout. */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/tareas" element={<Tasks />} />
            <Route path="/materias" element={<Subjects />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
