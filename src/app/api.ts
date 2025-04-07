import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL; 
//const API_URL = "http://localhost:5000/api"; // Cambia si tu backend usa otro puerto

// Obtener proyectos
export const getProyectos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/proyectos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return [];
  }
};

// Crear un nuevo proyecto
export const crearProyecto = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/proyectos`, {
      method: "POST",
      body: formData, 
    });

    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    return null;
  }
};

// Eliminar proyecto 

export const eliminarProyectoAPI = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/proyectos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    return true;
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    return false;
  }
};

