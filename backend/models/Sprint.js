import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true }, 
  }, {
  collection: 'Sprints'
});

export default mongoose.model("Sprint", sprintSchema);
