# EduTrack 📚☁️

**Aplicación móvil para la gestión de actividades académicas, conectada a la nube.**

Proyecto 2 — Unidad 2: *Integración de servicios en la nube*.

Arquitectura:

```
React + Vite (frontend)  →  Backend Express (api/, en Vercel)  →  MongoDB Atlas
        │                              ▲
        └────── Firebase Auth (login + verificación + JWT) ──────┘
```

- **Autenticación:** Firebase Authentication (registro, verificación por correo, JWT).
- **Datos:** MongoDB Atlas, a través de un backend que valida el token de Firebase.

---

## ✅ Cobertura de requerimientos

### Funcionales
| RF | Requerimiento | Estado | Cómo |
|----|---------------|--------|------|
| RF01 | Registro con correo y contraseña segura | ✅ | Firebase Auth + validación (mín. 8, letras y números) |
| RF02 | Correo automático con enlace de verificación | ✅ | `sendEmailVerification()`; el acceso se bloquea hasta verificar |
| RF03 | Login/logout con **JWT** | ✅ | El ID token de Firebase (JWT) se envía al backend, que lo **valida** en cada petición; se **destruye** al cerrar sesión |
| RF04 | CRUD de actividades (título, descripción, fecha, estado) | ✅ | Backend Express + MongoDB (Mongoose) |
| RF05 | Listado segmentado "Pendientes" / "Completadas" | ✅ | Control segmentado en la pantalla de Actividades |

### No funcionales
| RNF | Requerimiento | Estado | Cómo |
|-----|---------------|--------|------|
| RNF01 | Interfaz responsiva, enfoque móvil | ✅ | Diseño mobile-first + navegación inferior |
| RNF02 | React + Vite, desplegado en **Vercel** | ✅ | Frontend + funciones `api/` en Vercel |
| RNF03 | Base de datos NoSQL en **MongoDB Atlas** | ✅ | Toda la información se guarda en MongoDB Atlas |
| RNF04 | Carga inicial < 3 s | ✅ | Build optimizado (~254 KB gzip) |

> La seguridad de los datos se aplica en el **backend**: cada petición exige un token
> JWT válido de Firebase y todas las consultas se filtran por el `uid` del usuario,
> de modo que cada quien solo accede a su propia información.

---

## 🧰 Tecnologías

- **Frontend:** React 19 + Vite, React Router.
- **Autenticación:** Firebase Authentication.
- **Backend:** Node.js + Express (carpeta `api/`, serverless en Vercel).
- **Base de datos:** MongoDB Atlas + Mongoose.
- **API REST externa:** YouTube Data API v3 (búsqueda de recursos).

---

## 🔑 PASO 1 — Crear cuentas y credenciales

### A) Firebase (autenticación)
1. https://console.firebase.google.com → crea un proyecto.
2. **Authentication → Sign-in method →** habilita **Correo electrónico/contraseña**.
3. **⚙ Configuración del proyecto → Tus apps →** registra una app web (`</>`) y copia los 6 valores de `firebaseConfig` → van en `VITE_FIREBASE_*`.
4. **⚙ Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.**
   Del JSON descargado copia `client_email` y `private_key` → van en `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.

### B) MongoDB Atlas (base de datos)
1. https://www.mongodb.com/cloud/atlas/register → crea un clúster **M0 (gratis)**.
2. **Database Access → Add New Database User:** define un usuario y contraseña (anótalos).
3. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`).
4. **Connect → Drivers** → copia el *connection string* → va en `MONGODB_URI`.
   - Reemplaza `<password>` por la contraseña **real** del usuario de la base de datos.

### C) YouTube Data API v3
1. https://console.cloud.google.com (mismo proyecto) → **Biblioteca** → habilita *YouTube Data API v3*.
2. **Credenciales → Crear credenciales → Clave de API** → va en `VITE_YOUTUBE_API_KEY`.

---

## 🔧 PASO 2 — Configurar el `.env`

Llena el archivo [`.env`](.env):

```env
# Frontend (Firebase Auth)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_YOUTUBE_API_KEY=...

# Backend (no se exponen al navegador)
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## ▶️ PASO 3 — Ejecutar en local (DOS terminales)

```bash
npm install            # solo la primera vez

# Terminal 1 — backend (MongoDB)
npm run server         # http://localhost:3001

# Terminal 2 — frontend
npm run dev            # http://localhost:5173
```

Vite reenvía automáticamente las peticiones `/api` al backend (ver `vite.config.js`).

---

## 🚀 PASO 4 — Desplegar en Vercel (RNF02)

1. Sube el proyecto a GitHub e impórtalo en https://vercel.com.
2. Vercel detecta Vite (frontend) y la carpeta `api/` (funciones serverless) automáticamente.
3. En **Settings → Environment Variables**, agrega **todas** las variables del `.env`
   (las `VITE_*` y también `MONGODB_URI`, `FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY`).
4. **Deploy.** El archivo [`vercel.json`](vercel.json) configura el ruteo de la SPA.
5. En Firebase → Authentication → *Authorized domains*, agrega tu dominio `*.vercel.app`.

---

## 🗂️ Estructura

```
edutrack/
├─ .env                 ← credenciales (no se sube a git)
├─ vercel.json          ← ruteo SPA + funciones
├─ api/                 ← BACKEND (Express + MongoDB)
│  ├─ index.js          ← rutas CRUD de actividades y materias
│  └─ _lib/             ← db.js (Mongo), firebaseAdmin.js (JWT), models.js
├─ docs/                ← documentación entregable
└─ src/
   ├─ firebase/config.js      ← Firebase Auth
   ├─ context/AuthContext.jsx ← sesión + verificación por correo
   ├─ services/               ← api.js (fetch con JWT) + tasks/subjects/youtube
   ├─ components/  pages/  utils/
```

---

## 📦 Entregables (Unidad 2)

| Entregable | Dónde |
|---|---|
| Aplicación funcional conectada a la nube | `src/` + `api/` |
| Evidencias de autenticación y datos | [`docs/EVIDENCIAS.md`](docs/EVIDENCIAS.md) |
| Documentación técnica de APIs | [`docs/DOCUMENTACION-APIS.md`](docs/DOCUMENTACION-APIS.md) |
| Diagramas de flujo de datos | [`docs/DIAGRAMA-FLUJO.md`](docs/DIAGRAMA-FLUJO.md) |
| Video demostrativo | Guion en [`docs/GUION-VIDEO.md`](docs/GUION-VIDEO.md) |
