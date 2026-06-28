// Página de Materias: crear, editar y eliminar materias (guardadas en MongoDB).
import { useEffect, useState } from 'react'
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../services/subjectsService'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

const COLORES = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // Campos del formulario
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [color, setColor] = useState(COLORES[0])

  async function cargar() {
    try {
      setSubjects(await getSubjects())
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

  function abrirNueva() {
    setEditing(null)
    setName('')
    setTeacher('')
    setColor(COLORES[0])
    setModalOpen(true)
  }

  function abrirEditar(subject) {
    setEditing(subject)
    setName(subject.name)
    setTeacher(subject.teacher || '')
    setColor(subject.color || COLORES[0])
    setModalOpen(true)
  }

  async function guardar(e) {
    e.preventDefault()
    const data = { name: name.trim(), teacher: teacher.trim(), color }
    try {
      if (editing) {
        await updateSubject(editing.id, data)
      } else {
        await createSubject(data)
      }
      setModalOpen(false)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function eliminar(subject) {
    if (confirm(`¿Eliminar la materia "${subject.name}"?`)) {
      await deleteSubject(subject.id)
      await cargar()
    }
  }

  if (loading) return <Spinner full />

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Materias</h1>
          <p className="muted">{subjects.length} en total</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={abrirNueva}>
          + Nueva
        </button>
      </header>

      {error && <p className="form-error">{error}</p>}

      {subjects.length === 0 ? (
        <div className="empty">
          <p>Aún no tienes materias.</p>
          <button className="btn btn-primary" onClick={abrirNueva}>
            Agregar la primera
          </button>
        </div>
      ) : (
        <div className="list">
          {subjects.map((s) => (
            <div className="card subject-card" key={s.id}>
              <span className="subject-dot" style={{ background: s.color }} />
              <div className="subject-info">
                <h3>{s.name}</h3>
                {s.teacher && <p className="muted">{s.teacher}</p>}
              </div>
              <div className="card-actions">
                <button className="icon-btn" onClick={() => abrirEditar(s)} aria-label="Editar">
                  ✎
                </button>
                <button className="icon-btn danger" onClick={() => eliminar(s)} aria-label="Eliminar">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar materia' : 'Nueva materia'}
      >
        <form onSubmit={guardar} className="form">
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Matemáticas"
              required
            />
          </label>
          <label className="field">
            <span>Profesor (opcional)</span>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Nombre del profesor"
            />
          </label>
          <div className="field">
            <span>Color</span>
            <div className="color-picker">
              {COLORES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={c === color ? 'color-dot selected' : 'color-dot'}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Guardar cambios' : 'Crear materia'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
