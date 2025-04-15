import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import projectRoutes from "./routes/projectRoutes.js"; // Importar rutas
import sprintRoutes from "./routes/sprintRoutes.js"


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permitir formularios

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log(error));

// Servir archivos estáticos para imágenes subidas
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rutas proyecto
app.use("/api/proyectos", projectRoutes); 

// Rutas Sprints
app.use("/api/sprints", sprintRoutes)

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
