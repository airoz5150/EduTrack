# Guion del video demostrativo — EduTrack

Duración sugerida: **3 a 5 minutos**. Graba la pantalla (`Win + G` en Windows) y
narra cada paso. Ten la app corriendo (`npm run dev`) y la consola de Firebase
abierta en otra pestaña.

---

### 🎬 Escena 1 — Presentación (20 s)
- Di tu nombre, materia y el nombre del proyecto: **EduTrack**.
- Una frase: *“App móvil para gestionar actividades académicas, conectada a la nube”*.
- Tecnologías: React + Vite, Firebase (Auth + Firestore) y la API REST de YouTube.

### 🎬 Escena 2 — Registro y verificación por correo (RF01, RF02) (60 s)
- Muestra el **registro**; intenta una contraseña débil para que se vea la validación.
- Completa el registro → aparece la pantalla **“Verifica tu correo”**.
- Abre tu correo, muestra el **enlace de verificación** y haz clic.
- Regresa a la app, pulsa **“Ya verifiqué”** y entra al panel.
- Muestra en Firebase → **Authentication → Users** el usuario y su columna *Verificado*.

### 🎬 Escena 3 — Login / Logout con JWT (RF03) (30 s)
- Cierra sesión y vuelve a iniciar sesión.
- Menciona que Firebase usa un **token JWT** que se valida en cada operación y se
  destruye al cerrar sesión.

### 🎬 Escena 4 — CRUD de actividades (RF04) (50 s)
- Crea una **actividad**: título, descripción, materia, fecha de entrega y estado.
- **Edita** y luego **elimina** una para mostrar el CRUD completo.
- Ve a Firestore y muestra el documento guardado en la nube.

### 🎬 Escena 5 — Listado segmentado + tiempo real (RF05) (40 s)
- Muestra las pestañas **Pendientes** y **Completadas**.
- Marca una actividad como completada y muéstrala cambiar de pestaña.
- **Tiempo real:** abre la app en una segunda ventana, crea una actividad y muestra
  cómo aparece sola en la otra.

### 🎬 Escena 6 — Consumo de API REST (30 s)
- Ve a **Recursos**, busca un tema (ej. *“ecuaciones”*) y muestra los videos.

### 🎬 Escena 7 — Cierre (20 s)
- Resume cómo cada parte cumple los requerimientos. Agradece.

---

### Lista de verificación antes de subir el video
- [ ] Registro + validación de contraseña.
- [ ] Correo de verificación y cuenta activada.
- [ ] Login / logout.
- [ ] Crear, editar y eliminar actividad.
- [ ] Datos en Firestore + actualización en tiempo real.
- [ ] Pestañas Pendientes / Completadas.
- [ ] Búsqueda de videos (API REST).
