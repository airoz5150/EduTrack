// Barra de navegación superior (se muestra en pantallas de escritorio,
// dando un aspecto de página web). En móvil se usa la barra inferior.
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/tareas', label: 'Actividades' },
  { to: '/materias', label: 'Materias' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/perfil', label: 'Perfil' },
]

export default function TopNav() {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-logo">ET</span>
        <strong>EduTrack</strong>
      </div>
      <nav className="nav-links">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
