// Backend de EduTrack (API REST). CommonJS para que funcione como función
// serverless en Vercel y en local con `npm run server`.
// Autenticación: valida el token JWT de Firebase. Datos: MongoDB Atlas.
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./_lib/db')
const { getUidFromRequest } = require('./_lib/firebaseAdmin')
const { Activity, Subject } = require('./_lib/models')

const app = express()
// CORS abierto: la autenticación es por token JWT en el encabezado (no cookies),
// así que es seguro permitir que el APK móvil llame a la API desde otro origen.
app.use(cors())
app.use(express.json())

// Middleware para todas las rutas /api: conecta a MongoDB y valida el token.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
  } catch (e) {
    return res.status(500).json({ error: 'Error de conexión a MongoDB: ' + e.message })
  }
  let uid
  try {
    uid = await getUidFromRequest(req)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
  if (!uid) return res.status(401).json({ error: 'No autorizado (token inválido o ausente)' })
  req.uid = uid
  next()
})

// Quita campos que el cliente no debe poder modificar.
function limpiar(body) {
  const { uid, id, _id, createdAt, updatedAt, ...rest } = body || {}
  return rest
}

// ---------- Actividades (RF04) ----------
app.get('/api/activities', async (req, res) => {
  const items = await Activity.find({ uid: req.uid }).sort({ createdAt: -1 })
  res.json(items)
})

app.post('/api/activities', async (req, res) => {
  const item = await Activity.create({ ...limpiar(req.body), uid: req.uid })
  res.status(201).json(item)
})

app.put('/api/activities/:id', async (req, res) => {
  const item = await Activity.findOneAndUpdate(
    { _id: req.params.id, uid: req.uid },
    limpiar(req.body),
    { new: true },
  )
  if (!item) return res.status(404).json({ error: 'Actividad no encontrada' })
  res.json(item)
})

app.delete('/api/activities/:id', async (req, res) => {
  await Activity.deleteOne({ _id: req.params.id, uid: req.uid })
  res.json({ ok: true })
})

// ---------- Materias ----------
app.get('/api/subjects', async (req, res) => {
  const items = await Subject.find({ uid: req.uid }).sort({ createdAt: -1 })
  res.json(items)
})

app.post('/api/subjects', async (req, res) => {
  const item = await Subject.create({ ...limpiar(req.body), uid: req.uid })
  res.status(201).json(item)
})

app.put('/api/subjects/:id', async (req, res) => {
  const item = await Subject.findOneAndUpdate(
    { _id: req.params.id, uid: req.uid },
    limpiar(req.body),
    { new: true },
  )
  if (!item) return res.status(404).json({ error: 'Materia no encontrada' })
  res.json(item)
})

app.delete('/api/subjects/:id', async (req, res) => {
  await Subject.deleteOne({ _id: req.params.id, uid: req.uid })
  res.json({ ok: true })
})

// Arranque local (en Vercel no se ejecuta: la plataforma invoca la función).
const PORT = process.env.PORT || 3001
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`✅ API de EduTrack en http://localhost:${PORT}`))
}

module.exports = app
