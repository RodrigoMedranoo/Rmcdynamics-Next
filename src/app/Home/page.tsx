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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
        fetchProyectos();
      } else {
        router.push('/Login');
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

  if (checkingAuth || !user) return null;

  return (
    <main className="min-h-screen bg-background text-foreground container mx-auto p-4 transition-all duration-500 ease-in-out">
      <NavComponte />

      <section className="flex flex-col items-center justify-center mt-6 space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Inicio
        </h1>
        <p className="text-muted-foreground">Aquí puedes crear nuevos proyectos o tareas.</p>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-primary/40 transition-all"
        >
          Crear Nuevo Proyecto
        </Button>
      </section>

      {isModalOpen && (
        <CrearProyecto
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProyectoCreado}
        />
      )}

      <h2 className="text-2xl mt-10 mb-4 text-center">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
          Proyectos Creados
        </span>
      </h2>

      {loading ? (
        <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="p-4 space-y-4 bg-card border border-border/50 hover:border-primary/30 transition-colors">
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
        <p className="text-center text-muted-foreground mt-6">
          No hay proyectos creados.
        </p>
      ) : (
        <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {proyectos.map(proyecto => (
            <Card
              key={proyecto._id}
              className="p-4 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <CardHeader>
                <h3 className="text-lg font-bold text-primary group-hover:text-primary/90 transition-colors">
                  {proyecto.nombre}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {proyecto.descripcion}
                </p>
                {proyecto.imagen && (
                  <div className="flex justify-center my-5">
                    <Image
                      isBlurred
                      src={
                        proyecto.imagen.startsWith('/uploads')
                          ? `${API_URL}${proyecto.imagen}` // imagen personalizada (backend)
                          : ` ${proyecto.imagen}` // imagen predeterminada (frontend)
                      }
                      alt={proyecto.nombre}
                      className="rounded-md max-h-40 object-cover w-full group-hover:scale-[1.02] transition-transform duration-300"
                    />

                  </div>
                )}
                <div className="flex justify-between mt-4 gap-2">
                  <Button
                    variant="default"
                    className="w-[48%] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow hover:shadow-primary/30 transition-all"
                  >
                    <Link href={`/Progress/${proyecto._id}`}>Ver Detalles</Link>
                  </Button>
                  <Button
                    onClick={() => eliminarProyecto(proyecto._id)}
                    variant="destructive"
                    className="w-[48%] bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-500/90 hover:to-pink-600/90 text-white shadow hover:shadow-red-500/30 transition-all"
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}