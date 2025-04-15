import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fecha: String,
  estado: String,
  rol: String,
  completada: { type: Boolean, default: false },
});

const sprintSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  tareas: [tareaSchema],
  completado: { type: Boolean, default: false }, 
}, {
  collection: 'Sprints'
});

export default mongoose.model("Sprint", sprintSchema);
