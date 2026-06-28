// Utilidades de fecha para la app.

// Fecha de hoy en formato ISO (YYYY-MM-DD), respetando la zona horaria local.
export function hoyISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 10)
}

// Convierte 'YYYY-MM-DD' a un texto legible, p. ej. "25 jun 2026".
export function formatearFecha(iso) {
  if (!iso) return 'Sin fecha'
  const [y, m, d] = iso.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  return fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
