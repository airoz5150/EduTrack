// Pantalla de verificación de correo (RF02).
// Tras registrarse, el usuario debe abrir el enlace que le llegó por correo
// para activar su cuenta. Aquí puede reintentar o reenviar el correo.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const { user, reloadUser, resendVerification, logout } = useAuth()
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState('')
  const [checking, setChecking] = useState(false)

  async function yaVerifique() {
    setChecking(true)
    setMensaje('')
    try {
      const verificado = await reloadUser()
      if (verificado) {
        navigate('/')
      } else {
        setMensaje('Aún no detectamos la verificación. Abre el enlace del correo y vuelve a intentar.')
      }
    } finally {
      setChecking(false)
    }
  }

  async function reenviar() {
    setMensaje('')
    try {
      await resendVerification()
      setMensaje('Correo de verificación reenviado ✓ Revisa tu bandeja (y spam).')
    } catch {
      setMensaje('Espera un momento antes de volver a reenviar.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-logo">ET</span>
          <h1>EduTrack</h1>
        </div>
        <div className="verify-icon">📧</div>
        <h2 className="center">Verifica tu correo</h2>
        <p className="auth-subtitle">
          Enviamos un enlace de activación a<br />
          <strong>{user?.email}</strong>
        </p>
        <p className="muted center">
          Abre el correo y haz clic en el enlace para activar tu cuenta. Luego
          regresa aquí y pulsa el botón.
        </p>

        {mensaje && <p className="form-success">{mensaje}</p>}

        <div className="form">
          <button className="btn btn-primary" onClick={yaVerifique} disabled={checking}>
            {checking ? 'Comprobando…' : 'Ya verifiqué mi correo'}
          </button>
          <button className="btn btn-ghost" onClick={reenviar}>
            Reenviar correo
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
