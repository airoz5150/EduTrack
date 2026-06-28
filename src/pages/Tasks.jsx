// Página de Actividades (RF04 + RF05): lista segmentada por estado
// (Pendientes / Completadas), con CRUD completo guardado en MongoDB.
import { useEffect, useMemo, useState } from 'react'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/tasksService'
import { getSubjects } from '../services/subjectsService'
import { formatearFecha } from '../utils/format'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

const PRIORIDADES = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [segmento, setSegmento] = useState('pendiente') // RF05
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  // Campos del formulario
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('media')
  const [status, setStatus] = useState('pendiente')

  async function cargar() {
    try {
      const [t, s] = await Promise.all([getTasks(), getSubjects()])
      setTasks(t)
      setSubjects(s)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const pendientes = useMemo(
    () => tasks.filter((t) => t.status !== 'completada'),
    [tasks],
  )
  const completadas = useMemo(
    () => tasks.filter((t) => t.status === 'completada'),
    [tasks],
  )
  const visibles = segmento === 'completada' ? completadas : pendientes

  function abrirNueva() {
    setEditing(null)
    setTitle('')
    setDescription('')
    setSubjectId('')
    setDueDate('')
    setPriority('media')
    setStatus('pendiente')
    setModalOpen(true)
  }

  function abrirEditar(task) {
    setEditing(task)
    setTitle(task.title)
    setDescription(task.description || '')
    setSubjectId(task.subjectId || '')
    setDueDate(task.dueDate || '')
    setPriority(task.priority || 'media')
    setStatus(task.status || 'pendiente')
    setModalOpen(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const subject = subjects.find((s) => s.id === subjectId)
      const data = {
        title: title.trim(),
        description: description.trim(),
        subjectId: subjectId || null,
        subjectName: subject ? subject.name : '',
        subjectColor: subject ? subject.color : '#94a3b8',
        dueDate: dueDate || null,
        priority,
        status,
      }
      if (editing) {
        await updateTask(editing.id, data)
      } else {
        await createTask(data)
      }
      setModalOpen(false)
      await cargar()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function alternarEstado(task) {
    const nuevo = task.status === 'completada' ? 'pendiente' : 'completada'
    await updateTask(task.id, { status: nuevo })
    await cargar()
  }

  async function eliminar(task) {
    if (!confirm(`¿Eliminar la actividad "${task.title}"?`)) return
    await deleteTask(task.id)
    await cargar()
  }

  if (loading) return <Spinner full />

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Actividades</h1>
          <p className="muted">{tasks.length} en total</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={abrirNueva}>
          + Nueva
        </button>
      </header>

      {error && <p className="form-error">{error}</p>}

      {/* RF05: segmentación por estado */}
      <div className="segment">
        <button
          className={segmento === 'pendiente' ? 'seg active' : 'seg'}
          onClick={() => setSegmento('pendiente')}
        >
          Pendientes ({pendientes.length})
        </button>
        <button
          className={segmento === 'completada' ? 'seg active' : 'seg'}
          onClick={() => setSegmento('completada')}
        >
          Completadas ({completadas.length})
        </button>
      </div>

      {visibles.length === 0 ? (
        <div className="empty">
          <p>
            {segmento === 'completada'
              ? 'Aún no completas ninguna actividad.'
              : 'No tienes actividades pendientes. 🎉'}
          </p>
          {segmento === 'pendiente' && (
            <button className="btn btn-primary" onClick={abrirNueva}>
              Crear una actividad
            </button>
          )}
        </div>
      ) : (
        <div className="list">
          {visibles.map((t) => (
            <div className="card task-card" key={t.id}>
              <button
                className={t.status === 'completada' ? 'check checked' : 'check'}
                onClick={() => alternarEstado(t)}
                aria-label="Cambiar estado"
              >
                {t.status === 'completada' ? '✓' : ''}
              </button>

              <div className="task-info" onClick={() => abrirEditar(t)}>
                <div className="task-title-row">
                  <h3 className={t.status === 'completada' ? 'done' : ''}>
                    {t.title}
                  </h3>
                  <span className={`badge prio-${t.priority}`}>{t.priority}</span>
                </div>
                {t.description && <p className="muted task-desc">{t.description}</p>}
                <div className="task-meta">
                  {t.subjectName && (
                    <span
                      className="subject-tag"
                      style={{ background: t.subjectColor }}
                    >
                      {t.subjectName}
                    </span>
                  )}
                  <span className="muted">📅 {formatearFecha(t.dueDate)}</span>
                </div>
              </div>

              <button
                className="icon-btn danger"
                onClick={() => eliminar(t)}
                aria-label="Eliminar"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar actividad' : 'Nueva actividad'}
      >
        <form onSubmit={guardar} className="form">
          <label className="field">
            <span>Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Entregar ensayo"
              required
            />
          </label>

          <label className="field">
            <span>Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la actividad"
              rows={3}
            />
          </label>

          <label className="field">
            <span>Materia (opcional)</span>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Sin materia</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field-row">
            <label className="field">
              <span>Fecha de entrega</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Prioridad</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORIDADES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Estado</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear actividad'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
