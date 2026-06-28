// Conexión a MongoDB Atlas con caché (reutiliza la conexión entre invocaciones
// en entornos serverless). CommonJS para compatibilidad con Vercel.
const mongoose = require('mongoose')

let cached = global._mongoose
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Falta la variable MONGODB_URI en el archivo .env')

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: 'edutrack',
      bufferCommands: false,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = { connectDB }
