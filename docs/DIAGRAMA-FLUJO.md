# Diagramas de flujo de datos — EduTrack

Los diagramas usan sintaxis **Mermaid** (se ven directamente en GitHub). También se
incluye una versión en imagen: [`diagrama-flujo.svg`](diagrama-flujo.svg).

---

## 1. Arquitectura general

```mermaid
flowchart TB
    subgraph Movil["📱 App móvil (React + Vite)"]
        UI["Interfaz de usuario"]
        SVC["Servicios (services/)"]
        UI --> SVC
    end

    subgraph Cloud["☁️ Servicios en la nube"]
        AUTH["Firebase Authentication<br/>(registro, verificación, JWT)"]
        DB["Cloud Firestore<br/>(base de datos NoSQL)"]
        YT["YouTube Data API v3<br/>(API REST)"]
    end

    SVC -- "registro / login / verificación" --> AUTH
    SVC -- "CRUD en tiempo real (onSnapshot)" --> DB
    SVC -- "GET búsqueda de videos" --> YT

    AUTH -. "estado de sesión + JWT" .-> UI
    DB -. "cambios en tiempo real" .-> UI
```

---

## 2. Flujo de registro y verificación (RF01 + RF02)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as App (React)
    participant F as Firebase Auth

    U->>A: Ingresa nombre, correo y contraseña segura
    A->>F: createUserWithEmailAndPassword()
    F-->>A: Usuario creado
    A->>F: sendEmailVerification()
    F-->>U: 📧 Correo con enlace único de activación
    A-->>U: Pantalla "Verifica tu correo"
    U->>U: Abre el enlace del correo
    U->>A: Pulsa "Ya verifiqué"
    A->>F: reload() → emailVerified = true
    A-->>U: Acceso concedido al panel
```

---

## 3. Flujo de una actividad (CRUD + tiempo real — RF04/RF05)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as App (React)
    participant D as Cloud Firestore

    U->>A: Crea / edita una actividad
    A->>D: addDoc() / updateDoc() (con token JWT)
    D-->>A: onSnapshot dispara actualización
    A-->>U: La lista (Pendientes/Completadas) se actualiza al instante
    Note over D,A: El mismo onSnapshot actualiza<br/>cualquier otro dispositivo conectado
```

---

## 4. Modelo de datos (Firestore)

```mermaid
flowchart LR
    USERS["users"] --> UID["{uid}"]
    UID --> TASK["tasks/{id}"]
    UID --> SUBJ["subjects/{id}"]
    TASK --> TF["title, description,<br/>dueDate, status, priority"]
    SUBJ --> SF["name, teacher, color"]
```
