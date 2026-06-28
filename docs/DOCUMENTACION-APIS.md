# Documentación técnica de APIs — EduTrack

Este documento describe los servicios en la nube y las APIs que utiliza la
aplicación, junto con los métodos empleados y ejemplos de datos.

---

## 1. Firebase Authentication

Servicio de autenticación de usuarios mediante correo y contraseña, con
verificación de cuenta por correo electrónico.

**SDK:** `firebase/auth` · **Archivo:** `src/context/AuthContext.jsx`

| Operación | Método del SDK | Requerimiento |
|---|---|---|
| Registrar | `createUserWithEmailAndPassword(auth, email, pass)` | RF01 |
| Enviar verificación | `sendEmailVerification(user)` | RF02 |
| Iniciar sesión | `signInWithEmailAndPassword(auth, email, pass)` | RF03 |
| Cerrar sesión | `signOut(auth)` | RF03 |
| Escuchar sesión | `onAuthStateChanged(auth, cb)` | — |
| Actualizar nombre | `updateProfile(user, { displayName })` | — |

### Tokens JWT (RF03)

Al iniciar sesión, Firebase emite un **ID Token con formato JWT** (JSON Web Token)
firmado. Ese token:
- Se **valida** automáticamente en cada lectura/escritura a Firestore (las reglas
  de seguridad comprueban `request.auth`).
- Se **destruye** en el cliente al llamar `signOut()`.

### Verificación de cuenta (RF02)

Tras el registro se envía un correo automático con un **enlace único**. Hasta que el
usuario abre ese enlace, `user.emailVerified` es `false` y la app lo mantiene en la
pantalla de verificación (no puede entrar al contenido).

---

## 2. Cloud Firestore (base de datos NoSQL en tiempo real)

Base de datos NoSQL orientada a documentos. La sincronización en tiempo real se
logra con `onSnapshot`, que ejecuta un callback cada vez que cambian los datos.

**SDK:** `firebase/firestore` · **Archivos:** `src/services/tasksService.js`, `src/services/subjectsService.js`

### Modelo de datos

```
users/{uid}/
├── subjects/{subjectId}        (materias — función extra)
│     ├── name, teacher, color, createdAt
└── tasks/{taskId}              (actividades académicas — RF04)
      ├── title: string
      ├── description: string
      ├── dueDate: string (YYYY-MM-DD)   ← fecha de entrega
      ├── status: "pendiente" | "completada"   ← estado (RF05)
      ├── priority: "baja" | "media" | "alta"
      ├── subjectId, subjectName, subjectColor
      ├── uid: string
      ├── createdAt, updatedAt: timestamp
```

### Operaciones (CRUD — RF04)

| Operación | Método del SDK |
|---|---|
| Leer en tiempo real | `onSnapshot(query(...), cb)` |
| Crear | `addDoc(collection(...), data)` |
| Actualizar | `updateDoc(doc(...), data)` |
| Eliminar | `deleteDoc(doc(...))` |
| Ordenar | `query(col, orderBy('createdAt', 'desc'))` |

---

## 3. YouTube Data API v3 (API REST externa)

Permite buscar videos educativos. Es una API REST que se consume con `fetch`
mediante una petición HTTP GET.

**Archivo:** `src/services/youtubeService.js`

- **Método:** `GET`
- **Endpoint:** `https://www.googleapis.com/youtube/v3/search`
- **Autenticación:** parámetro `key` con la API key de Google Cloud.

### Ejemplo de petición

```http
GET https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=derivadas&maxResults=9&key=TU_API_KEY
```

### Ejemplo de respuesta (resumida)

```json
{
  "items": [
    {
      "id": { "videoId": "WUvTyaaNkzM" },
      "snippet": {
        "title": "Introducción a las derivadas",
        "channelTitle": "Canal de Matemáticas",
        "thumbnails": { "medium": { "url": "https://i.ytimg.com/vi/.../mq.jpg" } }
      }
    }
  ]
}
```

Si la clave no está configurada o la cuota se excede (`403`), el servicio lanza un
error con un mensaje legible que la interfaz muestra al usuario.

---

> **Nota:** Firebase Storage **no** se utiliza en este proyecto (ningún
> requerimiento exige subir archivos), por lo que no requiere el plan de pago.
