"use client";

import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { crearProyecto } from "@/app/api";

// Imágenes predeterminadas
const Image1 = '/predeterminadas/image1.jpg';
const Image2 = '/predeterminadas/image2.jpg';
const Image3 = '/predeterminadas/image3.jpg';

interface CrearProyectoProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const CrearProyecto = ({ onClose, onSuccess }: CrearProyectoProps) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(Image1);
    const [personalizada, setPersonalizada] = useState<File | null>(null);
    const [tipoImagen, setTipoImagen] = useState("predeterminada");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);

        if (tipoImagen === "personalizada" && personalizada) {
            formData.append("imagen", personalizada);
        } else {
            formData.append("imagen", imagen);
        }

        try {
            const proyectoCreado = await crearProyecto(formData);
            if (proyectoCreado) {
                onClose();
                if (onSuccess) onSuccess(); // Ejecutar callback de éxito
            }
        } catch (error: any) {
            console.error("Error al enviar los datos:", error);

            if (error.response && error.response.status === 400) {
                alert(error.response.data.error);
            } else {
                alert("Error al crear el proyecto.");
            }
        }
    };

    const handlePersonalizadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPersonalizada(file);
        } else {
            alert("Por favor, selecciona una imagen válida.");
        }
    };

    return (
        <Modal isOpen={true} onOpenChange={onClose}>
            <ModalContent>
                <>
                    <ModalHeader className="text-xl font-semibold">Crear Proyecto</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre del Proyecto */}
                            <div>
                                <label className="block text-sm font-medium">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium">Descripción del Proyecto</label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-md"
                                ></textarea>
                            </div>

                            {/* Opción de Imagen */}
                            <div>
                                <label className="block text-sm font-medium">Selecciona una opción de imagen</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="predeterminada"
                                            checked={tipoImagen === "predeterminada"}
                                            onChange={() => setTipoImagen("predeterminada")}
                                            className="mr-2"
                                        />
                                        Predeterminada
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="personalizada"
                                            checked={tipoImagen === "personalizada"}
                                            onChange={() => setTipoImagen("personalizada")}
                                            className="mr-2"
                                        />
                                        Personalizada
                                    </label>
                                </div>
                            </div>

                            {/* Selección de imagen predeterminada */}
                            {tipoImagen === "predeterminada" && (
                                <div>
                                    <label className="block text-sm font-medium">Selecciona una Imagen Predeterminada</label>
                                    <select
                                        value={imagen}
                                        onChange={(e) => setImagen(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value={Image1}>Imagen 1</option>
                                        <option value={Image2}>Imagen 2</option>
                                        <option value={Image3}>Imagen 3</option>
                                    </select>
                                    <img src={imagen} alt="Previsualización" className="w-32 mt-2 rounded-md" />
                                </div>
                            )}

                            {/* Subida de imagen personalizada */}
                            {tipoImagen === "personalizada" && (
                                <div>
                                    <label className="block text-sm font-medium">Carga una Imagen Personalizada</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePersonalizadaChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {personalizada && <img src={URL.createObjectURL(personalizada)} alt="Previsualización" className="w-32 mt-2 rounded-md" />}
                                </div>
                            )}
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
                            onClick={handleSubmit}
                        >
                            Crear Proyecto
                        </button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
};

export default CrearProyecto;