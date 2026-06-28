// Modelos de datos (esquemas de Mongoose) para MongoDB Atlas.
import mongoose from 'mongoose'

// Opciones comunes: fechas automáticas y conversión a JSON con campo "id".
const options = {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString()
      delete ret._id
      return ret
    },
  },
}

// Actividad académica (RF04)
const activitySchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subjectId: { type: String, default: null },
    subjectName: { type: String, default: '' },
    subjectColor: { type: String, default: '#94a3b8' },
    dueDate: { type: String, default: null }, // YYYY-MM-DD
    priority: { type: String, default: 'media' },
    status: { type: String, default: 'pendiente' }, // pendiente | completada
  },
  options,
)

// Materia (función extra)
const subjectSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, index: true },
    name: { type: String, required: true },
    teacher: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
  },
  options,
)

// Evita recompilar el modelo si ya existe (en recargas en caliente / serverless).
export const Activity =
  mongoose.models.Activity || mongoose.model('Activity', activitySchema)
export const Subject =
  mongoose.models.Subject || mongoose.model('Subject', subjectSchema)
