'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from 'firebaseconfig';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getProyectos, eliminarProyectoAPI } from '../api';
import NavComponte from '@/components/NavBar/navbar';
import { Image, Skeleton } from "@heroui/react";
import CrearProyecto from '@/CrearProyecto/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  // Verifica si el usuario está logeado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
        fetchProyectos();
      } else {
        router.push('/Login'); // o simplemente setUser(null) si no quieres redirigir
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const proyectosBackend = await getProyectos();
      setProyectos(proyectosBackend);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProyecto = async (id: string) => {
    const eliminado = await eliminarProyectoAPI(id);
    if (eliminado) {
      setProyectos(proyectos.filter(proyecto => proyecto._id !== id));
    } else {
      alert('Error al eliminar el proyecto.');
    }
  };

  const handleProyectoCreado = () => {
    fetchProyectos();
  };

  if (checkingAuth) return null; // o un loader

  if (!user) return null; // Si no quieres redirigir, solo ocultas todo

  return (
    <div className="container mx-auto p-4 text-center">
      <NavComponte />

      <div className="flex flex-col items-center justify-center mt-6 space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">Inicio</h1>
        <p className="text-gray-600">Aquí puedes crear nuevos proyectos o tareas.</p>
        <Button onClick={() => setIsModalOpen(true)}>Crear Nuevo Proyecto</Button>
      </div>

      {isModalOpen && (
        <CrearProyecto
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProyectoCreado}
        />
      )}

      <h2 className="text-2xl mt-8 text-blue-600">Proyectos Creados</h2>

      {loading ? (
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="p-4 space-y-4">
              <Skeleton className="rounded-lg">
                <div className="h-32 rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="w-3/4 rounded-lg">
                <div className="h-4 bg-default-200 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-2/3 rounded-lg">
                <div className="h-4 bg-default-200 rounded-lg" />
              </Skeleton>
              <div className="flex justify-between gap-4 mt-4">
                <Skeleton className="w-1/3 h-10 rounded-lg" />
                <Skeleton className="w-1/3 h-10 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : proyectos.length === 0 ? (
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
                  <Button variant="default">
                    <Link href={`/Progress/${proyecto._id}`}>Ver Detalles</Link>
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
