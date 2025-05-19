import express from "express";
import Project from "../models/Project.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });


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

router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let imagen = "";

    if (!nombre || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

if (req.file) {
  imagen = `/uploads/${req.file.filename}`; // 👈 ruta relativa solamente
}

    
    // ✅ Caso: Imagen predeterminada enviada como string
    else if (req.body.imagen && typeof req.body.imagen === "string" && req.body.imagen.startsWith("/predeterminadas/")) {
      imagen = req.body.imagen;
    } 
    
    // ❌ Ninguna imagen válida
    else {
      return res.status(400).json({ message: "La imagen es requerida." });
    }

    const nuevoProyecto = new Project({ nombre, descripcion, imagen });
    await nuevoProyecto.save();

    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ message: "Error al crear el proyecto" });
  }
});

// Ruta para eliminar un proyecto
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual (necesario porque estamos usando ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... (el resto de tus imports)

// Ruta para eliminar un proyecto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Primero obtenemos el proyecto para saber qué imagen tiene
    const proyecto = await Project.findById(id);
    
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Eliminar el proyecto de la base de datos
    const proyectoEliminado = await Project.findByIdAndDelete(id);

    // Si el proyecto tenía una imagen en uploads (no es una predeterminada), eliminarla
    if (proyecto.imagen && proyecto.imagen.startsWith('/uploads/')) {
      const filename = proyecto.imagen.replace('/uploads/', '');
      const imagePath = path.join(__dirname, '../uploads', filename);
      
      // Eliminar el archivo
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen:", err);
          // No devolvemos error aquí porque el proyecto ya se eliminó de la BD
        }
      });
    }

    res.status(200).json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    res.status(500).json({ message: "Error al eliminar el proyecto" });
  }
});

export default router;
