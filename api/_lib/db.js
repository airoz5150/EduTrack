// Conexión a MongoDB Atlas con caché (importante en entornos serverless:
// reutiliza la conexión entre invocaciones en lugar de abrir una nueva cada vez).
import mongoose from 'mongoose'

let cached = global._mongoose
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectDB() {
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
