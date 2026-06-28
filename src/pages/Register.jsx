// Página de registro de nuevos usuarios.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { traducirErrorAuth } from '../utils/authErrors'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    // RF01: validar que la contraseña sea segura.
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('La contraseña debe incluir letras y números.')
      return
    }
    setLoading(true)
    try {
      await register(email, password, name)
      navigate('/verify') // RF02: pasa a la pantalla de verificación por correo
    } catch (err) {
      setError(traducirErrorAuth(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-logo">ET</span>
          <h1>EduTrack</h1>
        </div>
        <p className="auth-subtitle">Crea tu cuenta para empezar</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </label>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres, letras y números"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
