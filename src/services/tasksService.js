// Servicio de Actividades: CRUD contra el backend (MongoDB Atlas).
import { apiFetch } from './api'

export const getTasks = () => apiFetch('/activities')

export const createTask = (data) =>
  apiFetch('/activities', { method: 'POST', body: data })

export const updateTask = (id, data) =>
  apiFetch(`/activities/${id}`, { method: 'PUT', body: data })

export const deleteTask = (id) =>
  apiFetch(`/activities/${id}`, { method: 'DELETE' })
