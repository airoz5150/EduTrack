# Guía de evidencias — EduTrack

Esta guía indica **qué capturas de pantalla tomar** para demostrar que cada
requerimiento funciona. Inserta cada captura en tu reporte final.

> 💡 Toma capturas tanto en la **app** como en la **consola de Firebase**, para
> probar que los datos realmente llegan a la nube.

---

## 1. Registro y contraseña segura (RF01) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 1.1 | Pantalla de **registro** llenada | App → Registro |
| 1.2 | Mensaje de error al usar contraseña débil | App (demuestra la validación) |
| 1.3 | Usuario creado | Firebase → **Authentication → Users** |

## 2. Verificación por correo (RF02) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 2.1 | Pantalla "Verifica tu correo" | App (después de registrarte) |
| 2.2 | El **correo recibido** con el enlace de activación | Tu bandeja de entrada |
| 2.3 | Columna "Verificado" del usuario | Firebase → Authentication → Users |

## 3. Login / Logout con token JWT (RF03) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 3.1 | Inicio de sesión exitoso | App → Login |
| 3.2 | Error con credenciales inválidas | App |
| 3.3 | (Opcional) El **ID token (JWT)** en DevTools | Navegador → Application → IndexedDB/Local, o consola |
| 3.4 | Cerrar sesión y volver al login | App → Perfil → Cerrar sesión |

## 4. CRUD de actividades (RF04) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 4.1 | Crear, editar y eliminar una actividad | App → Actividades |
| 4.2 | Documentos guardados | Firebase → **Firestore Database** → `users/{uid}/tasks` |
| 4.3 | **Sincronización en tiempo real** | Abre la app en dos ventanas; crea una actividad en una y muéstrala aparecer sola en la otra |

## 5. Listado segmentado (RF05) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 5.1 | Pestañas **Pendientes** y **Completadas** con actividades | App → Actividades |
| 5.2 | Marcar una actividad como completada y verla cambiar de pestaña | App |

## 6. Consumo de API REST (extra) ✅

| # | Evidencia | Dónde |
|---|---|---|
| 6.1 | Buscar un tema en **Recursos** y mostrar los videos | App → Recursos |

## 7. Seguridad ✅

| # | Evidencia | Dónde |
|---|---|---|
| 7.1 | Reglas de Firestore publicadas | Firebase → Firestore → **Reglas** |

---

### Sugerencia de orden para el reporte
Registro → correo de verificación → usuario verificado en consola → login →
crear/editar/eliminar actividad → datos en Firestore → sincronización en tiempo
real → pestañas Pendientes/Completadas → búsqueda de videos.
