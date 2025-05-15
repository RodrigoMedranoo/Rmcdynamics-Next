'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../../../firebaseconfig';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getProyectos, eliminarProyectoAPI } from '@/app/api';
import NavComponte from '@/components/NavBar/navbar';
import Link from 'next/link';
import { Skeleton } from "@heroui/react";

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
                fetchProyectos();
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

    const eliminarProyecto = async (id: string) => {
        const eliminado = await eliminarProyectoAPI(id);
        if (eliminado) {
            setProyectos(proyectos.filter(proyecto => proyecto._id !== id));
        } else {
            alert('Error al eliminar el proyecto.');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground container mx-auto px-4 pt-16 pb-8">
            <NavComponte />

            {/* Contenido principal con más espacio superior */}
            <div className="text-center mt-8">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Bienvenido, {userAuth ? userAuth.split('@')[0] : 'Invitado'}
                </h1>

                {(userAuth || userAuth === null) && (
                    <Button
                        onClick={handleLogout}
                        className="mt-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-500/90 hover:to-pink-600/90 text-white shadow hover:shadow-red-500/30 transition-all px-6 py-3"
                    >
                        Cerrar sesión
                    </Button>
                )}

                {/* Lista de proyectos */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Tus Proyectos
                    </h2>

                    {loading ? (
                        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="p-4 bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-2/3 rounded-lg bg-default-200" />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-3 w-4/5 rounded-lg bg-default-200" />
                                        <div className="flex justify-between mt-4 gap-2">
                                            <Skeleton className="w-1/2 h-8 rounded-md bg-default-300" />
                                            <Skeleton className="w-1/2 h-8 rounded-md bg-default-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : proyectos.length > 0 ? (
                        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                            {proyectos.map((proyecto) => (
                                <Card key={proyecto._id} className="p-4 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                    <CardHeader>
                                        <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                                            {proyecto.nombre}
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
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
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground text-xl">
                                No tienes proyectos creados.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;