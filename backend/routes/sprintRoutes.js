import express from "express";
import Sprint from "../models/Sprint.js";

const router = express.Router();

// Ruta para crear un nuevo sprint
router.post("/", async (req, res) => {
  const { nombre, fechaInicio, fechaFin, proyectoId } = req.body;
  console.log('nombredelproyecto', nombre)
  /* const { nuevoSprint, proyectoId } = req.body;
  console.log('variable de id: ', req.body)
  console.log(nuevoSprint)
  console.log(first)
  const {nombre, fechaInicio, fechaFin}= nuevoSprint; */
  
  if (!proyectoId) {
    return res.status(400).json({ message: "Falta el proyectoId" });
  }

  try {
    const nuevoSprint = new Sprint({ nombre, fechaInicio, fechaFin, proyectoId });
    await nuevoSprint.save();
    res.status(201).json(nuevoSprint); // Retorna el sprint creado
  } catch (error) {
    console.error("Error al crear el sprint:", error);
    res.status(500).json({ message: "Error al crear el sprint" });
  }
});

// Ruta para obtener los sprints por proyectoId
router.get("/", async (req, res) => {
  const { proyectoId } = req.query;

  try {
    if (!proyectoId) {
      return res.status(400).json({ message: "El parámetro proyectoId es requerido" });
    }

    const sprints = await Sprint.find({ proyectoId });

    if (sprints.length === 0) {
      return res.status(404).json({ message: "No se encontraron sprints para este proyecto" });
    }

    res.status(200).json(sprints);
  } catch (error) {
    console.error("Error al obtener los sprints:", error);
    res.status(500).json({ message: "Error al obtener los sprints" });
  }
});

// Eliminar sprint por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sprintEliminado = await Sprint.findByIdAndDelete(id);

    if (!sprintEliminado) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }

    res.status(200).json({ message: "Sprint eliminado correctamente", sprint: sprintEliminado });
  } catch (error) {
    console.error("Error al eliminar el sprint:", error);
    res.status(500).json({ message: "Error al eliminar el sprint" });
  }
});

// Obtener un sprint por su ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sprint = await Sprint.findById(id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }
    res.status(200).json(sprint);
  } catch (error) {
    console.error("Error al obtener el sprint:", error);
    res.status(500).json({ message: "Error al obtener el sprint" });
  }
});

// Actualizar un sprint (tareas o estado)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const sprintActualizado = await Sprint.findByIdAndUpdate(id, data, { new: true });
    if (!sprintActualizado) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }
    res.status(200).json(sprintActualizado);
  } catch (error) {
    console.error("Error al actualizar el sprint:", error);
    res.status(500).json({ message: "Error al actualizar el sprint" });
  }
});


export default router;
