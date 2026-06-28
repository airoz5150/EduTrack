// Pantalla que se muestra cuando aún NO se han configurado las credenciales
// de Firebase en el archivo .env. Guía al usuario paso a paso.
export default function SetupNeeded() {
  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="brand">
          <span className="brand-logo">ET</span>
          <h1>EduTrack</h1>
        </div>
        <h2>Falta configurar las credenciales</h2>
        <p>
          La aplicación está lista, pero todavía necesita las claves de
          Firebase para conectarse a la nube. Sigue estos pasos:
        </p>
        <ol className="setup-steps">
          <li>
            Entra a{' '}
            <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">
              console.firebase.google.com
            </a>{' '}
            y crea un proyecto.
          </li>
          <li>
            Activa <strong>Authentication</strong> (método Correo/Contraseña),{' '}
            <strong>Firestore Database</strong> y <strong>Storage</strong>.
          </li>
          <li>
            En <em>Configuración del proyecto → Tus apps</em>, registra una app
            web y copia el objeto <code>firebaseConfig</code>.
          </li>
          <li>
            Abre el archivo <code>.env</code> en la raíz del proyecto y pega
            cada valor (ya están las variables vacías esperándote).
          </li>
          <li>
            Detén el servidor y vuelve a ejecutar <code>npm run dev</code>.
          </li>
        </ol>
        <p className="setup-note">
          Las instrucciones completas (incluida la API key de YouTube) están en
          el archivo <code>README.md</code>.
        </p>
      </div>
    </div>
  )
}
