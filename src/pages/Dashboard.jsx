// Página de Inicio: resumen con estadísticas y próximas entregas.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTasks } from '../services/tasksService'
import { getSubjects } from '../services/subjectsService'
import { hoyISO, formatearFecha } from '../utils/format'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [t, s] = await Promise.all([getTasks(), getSubjects()])
        setTasks(t)
        setSubjects(s)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const stats = useMemo(() => {
    const hoy = hoyISO()
    const completadas = tasks.filter((t) => t.status === 'completada').length
    const pendientes = tasks.filter((t) => t.status !== 'completada').length
    const vencidas = tasks.filter(
      (t) => t.status !== 'completada' && t.dueDate && t.dueDate < hoy,
    ).length
    return { total: tasks.length, completadas, pendientes, vencidas }
  }, [tasks])

  const proximas = useMemo(() => {
    const hoy = hoyISO()
    return tasks
      .filter((t) => t.status !== 'completada' && t.dueDate && t.dueDate >= hoy)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4)
  }, [tasks])

  if (loading) return <Spinner full />

  const nombre = user?.displayName || user?.email?.split('@')[0] || 'estudiante'

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="muted">¡Hola de nuevo!</p>
          <h1>{nombre}</h1>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Actividades</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.pendientes}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card">
          <span className="stat-num accent-green">{stats.completadas}</span>
          <span className="stat-label">Completadas</span>
        </div>
        <div className="stat-card">
          <span className="stat-num accent-red">{stats.vencidas}</span>
          <span className="stat-label">Vencidas</span>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Próximas entregas</h2>
          <Link to="/tareas" className="link">
            Ver todas
          </Link>
        </div>
        {proximas.length === 0 ? (
          <div className="empty small">
            <p>No tienes entregas próximas. 🎉</p>
          </div>
        ) : (
          <div className="list">
            {proximas.map((t) => (
              <div className="card mini-task" key={t.id}>
                <span
                  className="subject-dot"
                  style={{ background: t.subjectColor || '#94a3b8' }}
                />
                <div className="task-info">
                  <h3>{t.title}</h3>
                  <p className="muted">
                    {t.subjectName || 'Sin materia'} · 📅{' '}
                    {formatearFecha(t.dueDate)}
                  </p>
                </div>
                <span className={`badge prio-${t.priority}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Mis materias</h2>
          <Link to="/materias" className="link">
            Administrar
          </Link>
        </div>
        {subjects.length === 0 ? (
          <div className="empty small">
            <p>Aún no agregas materias.</p>
          </div>
        ) : (
          <div className="subject-chips">
            {subjects.map((s) => (
              <span className="subject-chip" key={s.id}>
                <span className="subject-dot" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
