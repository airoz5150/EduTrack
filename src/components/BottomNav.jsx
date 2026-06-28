// Barra de navegación inferior, estilo app móvil.
import { NavLink } from 'react-router-dom'

const items = [
  {
    to: '/',
    label: 'Inicio',
    icon: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  },
  {
    to: '/tareas',
    label: 'Tareas',
    icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  },
  {
    to: '/materias',
    label: 'Materias',
    icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
  },
  {
    to: '/recursos',
    label: 'Recursos',
    icon: 'M23 7l-7 5 7 5V7zM1 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z',
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={item.icon} />
          </svg>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
