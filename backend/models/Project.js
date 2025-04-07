import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
}, {
  collection: 'Proyecto' // Especificamos que queremos guardar en la colección "Proyecto"
});

const sprintSchema = new mongoose.Schema({
  nombre: String,
  fechaInicio: String,
  fechaFin: String,
  tareas: [String], // o puedes definir un modelo más complejo si tienes tareas como objetos
  completado: Boolean,
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, {
  collection: 'Sprint'
});

export const Sprint = mongoose.model("Sprint", sprintSchema);
export const Project = mongoose.model("Project", projectSchema);
