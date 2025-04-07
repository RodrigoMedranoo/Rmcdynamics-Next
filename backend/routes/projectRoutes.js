import express from "express";
import { Project } from "../models/Project.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar almacenamiento de imágenes con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
  },
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo proyecto
// Ruta para crear un nuevo proyecto evitando nombres duplicados
// Ruta para crear un nuevo proyecto
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let imagenData = null;

    // Verificar si el nombre ya existe
    const proyectoExistente = await Project.findOne({ nombre });
    if (proyectoExistente) {
      return res.status(400).json({ error: "El nombre del proyecto ya está en uso." });
    }

    // Si se cargó una imagen, guardar la ruta
    if (req.file) {
      imagenData = `/uploads/${req.file.filename}`;
    } else {
      imagenData = req.body.imagen; // Si es una imagen predeterminada
    }

    const nuevoProyecto = new Project({
      nombre,
      descripcion,
      imagen: imagenData,
    });

    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    res.status(500).json({ error: "No se pudo guardar el proyecto" });
  }
});



// Obtener todos los proyectos
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un proyecto por ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un proyecto
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un proyecto
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener sprints por proyecto
router.get("/:proyectoId", async (req, res) => {
  try {
    const sprints = await Sprint.find({ proyectoId: req.params.proyectoId });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los sprints" });
  }
});

// Crear nuevos sprints para un proyecto
router.post("/:proyectoId", async (req, res) => {
  try {
    const { sprints } = req.body; // array de sprints desde el frontend
    const proyectoId = req.params.proyectoId;

    const nuevosSprints = sprints.map(s => ({
      ...s,
      proyectoId,
    }));

    const creados = await Sprint.insertMany(nuevosSprints);
    res.status(201).json(creados);
  } catch (error) {
    res.status(500).json({ error: "Error al crear los sprints" });
  }
});

// Eliminar sprints seleccionados
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body; // array de _id de los sprints
    await Sprint.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Sprints eliminados" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar sprints" });
  }
});

export default router;
