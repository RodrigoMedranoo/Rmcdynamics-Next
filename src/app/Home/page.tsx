'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getProyectos, eliminarProyectoAPI } from '../api';
import NavComponte from '@/components/NavBar/navbar';
import { Image } from "@heroui/react";
import CrearProyecto from '@/CrearProyecto/page';
//import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para cargar proyectos
  const fetchProyectos = async () => {
    try {
      const proyectosBackend = await getProyectos();
      setProyectos(proyectosBackend);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };



  useEffect(() => {
    fetchProyectos();
  }, []);

  const eliminarProyecto = async (id: string) => {
    const eliminado = await eliminarProyectoAPI(id);
    if (eliminado) {
      setProyectos(proyectos.filter(proyecto => proyecto._id !== id));
    } else {
      alert('Error al eliminar el proyecto.');
    }
  };

  // Función que se ejecuta cuando se crea un proyecto exitosamente
  const handleProyectoCreado = () => {
    fetchProyectos(); // Recargar la lista de proyectos
  };

  //const router = useRouter();
  function handleClickChangePage(id: String): void {
    //router.push(`/Progress/${id}`)
  }

  return (
    <div className="container mx-auto p-4 text-center">
      {/* NavBar */}
      <NavComponte />

      <div className="flex flex-col items-center justify-center mt-6 space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">Inicio</h1>
        <p className="text-gray-600">Aquí puedes crear nuevos proyectos o tareas.</p>
        <Button onClick={() => setIsModalOpen(true)}>Crear Nuevo</Button>
      </div>
      {/* Modal para crear proyecto */}
      {isModalOpen && (
        <CrearProyecto
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProyectoCreado}
        />
      )}

      {/* Lista de proyectos */}
      <h2 className="text-2xl mt-8 text-blue-600">Proyectos Creados</h2>
      {proyectos.length === 0 ? (
        <p className="text-gray-600">No hay proyectos creados.</p>
      ) : (
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {proyectos.map(proyecto => (
            <Card key={proyecto._id} className="p-4">
              <CardHeader>
                <h3 className="text-lg font-bold">{proyecto.nombre}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{proyecto.descripcion}</p>
                {proyecto.imagen && (
                  <div className="flex justify-center my-5">
                    <Image
                      isBlurred
                      src={proyecto.imagen.includes('uploads')
                        ? `${API_URL}${proyecto.imagen}`
                        : `/${proyecto.imagen}`
                      }
                      alt={proyecto.nombre}
                      className="rounded-md max-h-40 object-cover w-full"
                    />
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <Button /* onClick={() => handleClickChangePage(proyecto._id)} */ variant="default">
                    <Link href={`/Progress/?id=${proyecto._id}`}>Ver Detalles</Link>
                  </Button>
                  <Button onClick={() => eliminarProyecto(proyecto._id)} variant="destructive">
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}