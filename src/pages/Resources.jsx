// Página de Recursos: consume la API REST de YouTube para buscar
// videos educativos sobre un tema. Demuestra el consumo de servicios web.
import { useState } from 'react'
import { searchVideos, youtubeConfigured } from '../services/youtubeService'

export default function Resources() {
  const [texto, setTexto] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [buscado, setBuscado] = useState(false)

  async function buscar(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setLoading(true)
    setError('')
    setBuscado(true)
    try {
      const resultados = await searchVideos(texto.trim())
      setVideos(resultados)
    } catch (err) {
      setError(err.message)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Recursos</h1>
          <p className="muted">Busca videos educativos</p>
        </div>
      </header>

      {!youtubeConfigured && (
        <div className="notice">
          ⚠️ La búsqueda de videos requiere configurar{' '}
          <code>VITE_YOUTUBE_API_KEY</code> en el archivo <code>.env</code>.
          Consulta el <code>README.md</code>.
        </div>
      )}

      <form onSubmit={buscar} className="search-bar">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej. derivadas, revolución mexicana…"
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? '…' : 'Buscar'}
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {loading && <p className="muted center">Buscando videos…</p>}

      {!loading && buscado && videos.length === 0 && !error && (
        <div className="empty small">
          <p>Sin resultados.</p>
        </div>
      )}

      <div className="video-grid">
        {videos.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noreferrer"
            className="card video-card"
          >
            <img src={v.thumbnail} alt="" loading="lazy" />
            <div className="video-info">
              <h3>{v.title}</h3>
              <p className="muted">{v.channel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
