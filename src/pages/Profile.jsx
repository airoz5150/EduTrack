// Página de Perfil: datos del usuario, editar nombre y cerrar sesión.
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout, refreshUser } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function guardarNombre(e) {
    e.preventDefault()
    setSaving(true)
    setMensaje('')
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() })
      refreshUser()
      setMensaje('Nombre actualizado ✓')
    } finally {
      setSaving(false)
    }
  }

  const iniciales = (user?.displayName || user?.email || '?')
    .charAt(0)
    .toUpperCase()

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Perfil</h1>
        </div>
      </header>

      <div className="profile-top">
        <div className="avatar placeholder">{iniciales}</div>
        <h2>{user?.displayName || 'Sin nombre'}</h2>
        <p className="muted">{user?.email}</p>
        {user?.emailVerified && (
          <span className="verified-badge">✓ Cuenta verificada</span>
        )}
      </div>

      {mensaje && <p className="form-success">{mensaje}</p>}

      <form onSubmit={guardarNombre} className="form card">
        <label className="field">
          <span>Nombre para mostrar</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar nombre'}
        </button>
      </form>

      <button className="btn btn-danger full" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
