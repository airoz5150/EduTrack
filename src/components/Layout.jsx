// Estructura general de la app.
// Escritorio: barra superior (vista web). Móvil: barra inferior (vista app).
import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
