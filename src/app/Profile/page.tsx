'use client'; // Aseguramos que el código se ejecute solo en el cliente

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../../../firebaseconfig';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getProyectos, eliminarProyectoAPI } from '@/app/api';
import NavComponte from '@/components/NavBar/navbar';
import Link from 'next/link';
import { Skeleton } from "@heroui/react"; // Importamos Skeleton de Heroui

const Profile = () => {
    const auth = getAuth(app);
    const router = useRouter();
    const [userAuth, setUserAuth] = useState(null);
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserAuth(user.email);
                fetchProyectos(); // Cargar proyectos cuando el usuario esté autenticado
            } else {
                setUserAuth(null);
                setProyectos([]);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const fetchProyectos = async () => {
        try {
            const response = await getProyectos();
            setProyectos(response);
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await eliminarProyectoAPI(id);
            if (response) {
                setProyectos(proyectos.filter((proyecto) => proyecto._id !== id));
            } else {
                alert('Error al eliminar el proyecto');
            }
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
            alert('Error al eliminar el proyecto');
        }
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                router.push('/Login');
            })
            .catch((error) => console.error('Error al cerrar sesión:', error));
    };

    return (
        <div className="container mx-auto p-4">
            <NavComponte /> {/* Aquí incluyes tu componente de navegación */}

            {/* Contenido principal */}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Bienvenido, {userAuth || 'Invitado'}</h1>
                {userAuth && (
                    <Button onClick={handleLogout} variant="default" className="mt-4">
                        Cerrar sesión
                    </Button>
                )}

                {/* Lista de proyectos */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Tus Proyectos</h2>
                    {loading ? (
                        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Skeleton Loader para los proyectos */}
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="border p-4 rounded-md shadow-lg">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-2/3 rounded-lg" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                                        <div className="mt-4 space-x-2">
                                            <Skeleton className="w-1/3 h-8 rounded-md" />
                                            <Skeleton className="w-1/3 h-8 rounded-md" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : proyectos.length > 0 ? (
                        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                            {proyectos.map((proyecto) => (
                                <Card key={proyecto._id} className="border p-4 rounded-md shadow-lg">
                                    <CardHeader>
                                        <h3 className="text-lg font-bold">{proyecto.nombre}</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between mt-4">
                                            <Button variant="default">
                                                <Link href={`/Progress/${proyecto._id}`}>Ver Detalles</Link>
                                            </Button>
                                            <Button onClick={() => eliminarProyectoAPI(proyecto._id)} variant="destructive">
                                                Eliminar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>No tienes proyectos creados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
