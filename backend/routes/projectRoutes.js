import express from "express";
import Project from "../models/Project.js";


const router = express.Router();

// Ruta para obtener todos los proyectos
router.get("/", async (req, res) => {
  try {
    const proyectos = await Project.find();
    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    res.status(500).json({ message: "Error al obtener los proyectos" });
  }
});

// Ruta para crear un nuevo proyecto
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const nuevoProyecto = new Project({ nombre, descripcion });
    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ message: "Error al crear el proyecto" });
  }
});

// Ruta para eliminar un proyecto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const proyectoEliminado = await Project.findByIdAndDelete(id);

    if (!proyectoEliminado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    res.status(500).json({ message: "Error al eliminar el proyecto" });
  }
});

export default router;
