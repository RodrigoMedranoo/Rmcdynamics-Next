import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
}, {
  collection: 'Proyecto' // Especificamos que queremos guardar en la colección "Proyecto"
});

export const Project = mongoose.model("Project", projectSchema);
