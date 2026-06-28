// Servicio de Materias: CRUD contra el backend (MongoDB Atlas).
import { apiFetch } from './api'

export const getSubjects = () => apiFetch('/subjects')

export const createSubject = (data) =>
  apiFetch('/subjects', { method: 'POST', body: data })

export const updateSubject = (id, data) =>
  apiFetch(`/subjects/${id}`, { method: 'PUT', body: data })

export const deleteSubject = (id) =>
  apiFetch(`/subjects/${id}`, { method: 'DELETE' })
