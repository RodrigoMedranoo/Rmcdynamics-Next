'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavComponentProgress from '@/components/NavBar/navbarprogress';
import axios from 'axios';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Skeleton
} from '@heroui/react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Progress({ params }) {
    const idProject = params.id;
    const router = useRouter();
    const [sprints, setSprints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sprintsSeleccionados, setSprintsSeleccionados] = useState<string[]>([]);
    const [proyectoId, setProyectoId] = useState<string>('');
    const [errorFechas, setErrorFechas] = useState(false);
    const [nuevoSprint, setNuevoSprint] = useState({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (idProject) {
            setProyectoId(idProject);
            obtenerSprints(idProject);
        }
    }, [idProject]);

    useEffect(() => {
        const { fechaInicio, fechaFin } = nuevoSprint;
        if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
            setErrorFechas(true);
        } else {
            setErrorFechas(false);
        }
    }, [nuevoSprint.fechaInicio, nuevoSprint.fechaFin]);

    const obtenerSprints = async (id: string) => {
        try {
            const res = await axios.get(`${API_URL}/api/sprints?proyectoId=${id}`);
            setSprints(res.data);
        } catch (error) {
            console.error('Error obteniendo sprints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSprint = async () => {
        if (errorFechas) return;
        try {
            const newSprint = { ...nuevoSprint, proyectoId: idProject };
            const response = await axios.post(`${API_URL}/api/sprints`, newSprint);
            setSprints((prev) => [...prev, response.data]);
            setNuevoSprint({ nombre: '', fechaInicio: '', fechaFin: '' });
            onClose();
        } catch (error) {
            console.error('Error creando sprint:', error);
        }
    };

    const eliminarSprintsSeleccionados = async () => {
        try {
            await Promise.all(
                sprintsSeleccionados.map((nombre) => {
                    const sprint = sprints.find((s) => s.nombre === nombre);
                    return axios.delete(`${API_URL}/api/sprints/${sprint._id}`);
                })
            );
            setSprints((prev) => prev.filter((s) => !sprintsSeleccionados.includes(s.nombre)));
            setSprintsSeleccionados([]);
        } catch (error) {
            console.error('Error eliminando sprints:', error);
        }
    };

    const manejarSeleccionSprint = (nombre: string) => {
        setSprintsSeleccionados((prev) =>
            prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
        );
    };

    const calcularProgresoTotal = () => {
        const totalSprints = sprints.length;
        const sprintsCompletados = sprints.filter((s) => s.completado).length;
        return totalSprints === 0 ? 0 : (sprintsCompletados / totalSprints) * 100;
    };

    return (
        <div className="min-h-screen bg-background container mx-auto p-4">
            <NavComponentProgress />

            <div className="text-center mt-6 space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Progreso de Sprints
                </h1>
            </div>
            <div className="text-center mt-6 space-y-4">
                <p className="text-muted-foreground">
                    Gestiona y visualiza el estado de tus sprints.
                </p>
            </div>

            <div className="my-6 text-center">
                <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Progreso total
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden mb-1 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${calcularProgresoTotal()}%` }}
                    ></div>
                </div>
                <p className="text-muted-foreground text-lg">
                    {Math.round(calcularProgresoTotal())}% Completado
                </p>
            </div>

            <div className="flex justify-center gap-4 my-6">
                <Button
                    onClick={onOpen}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                    Agregar Sprint
                </Button>
                <Button
                    variant="destructive"
                    disabled={sprintsSeleccionados.length === 0}
                    onClick={eliminarSprintsSeleccionados}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-500/90 hover:to-pink-600/90 text-white shadow hover:shadow-red-500/30 transition-all"
                >
                    Eliminar Seleccionados
                </Button>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onClose}>
                <ModalContent className="bg-background border-border">
                    <ModalHeader className="flex flex-col gap-1 text-foreground">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl font-bold">
                            Crear Sprint
                        </span>
                    </ModalHeader>
                    <ModalBody>
                        <label className="block mb-2 text-foreground">Nombre del Sprint</label>
                        <input
                            type="text"
                            value={nuevoSprint.nombre}
                            onChange={(e) => setNuevoSprint({ ...nuevoSprint, nombre: e.target.value })}
                            className="w-full px-4 py-2 mb-4 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <label className="block mb-2 text-foreground">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={nuevoSprint.fechaInicio}
                            onChange={(e) => setNuevoSprint({ ...nuevoSprint, fechaInicio: e.target.value })}
                            className="w-full px-4 py-2 mb-4 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <label className="block mb-2 text-foreground">Fecha de Fin</label>
                        <input
                            type="date"
                            value={nuevoSprint.fechaFin}
                            onChange={(e) => setNuevoSprint({ ...nuevoSprint, fechaFin: e.target.value })}
                            className="w-full px-4 py-2 mb-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {errorFechas && (
                            <p className="text-red-500 text-sm mb-2">
                                La fecha de inicio no puede ser posterior a la fecha de fin.
                            </p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="destructive"
                            onClick={onClose}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-500/90 hover:to-pink-600/90 text-white shadow hover:shadow-red-500/30 transition-all"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateSprint}
                            disabled={errorFechas}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            Crear Sprint
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="p-4 space-y-4 bg-card border border-border/50 hover:border-primary/30 transition-colors">
                            <CardHeader>
                                <Skeleton className="w-3/4 h-6 rounded-lg bg-default-200" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-1/2 rounded-lg bg-default-100" />
                                <Skeleton className="h-3 w-4/5 rounded-lg bg-default-200" />
                                <Skeleton className="h-3 w-2/3 rounded-lg bg-default-200" />
                                <div className="flex justify-between mt-4">
                                    <Skeleton className="h-8 w-24 rounded-md bg-default-300" />
                                    <Skeleton className="h-4 w-20 rounded-md bg-default-200" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : sprints.length === 0 ? (
                    <p className="text-center text-muted-foreground col-span-full py-10">
                        No hay sprints disponibles para mostrar.
                    </p>
                ) : (
                    sprints.map((sprint) => (
                        <Card
                            key={sprint._id}
                            className="p-4 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                                        {sprint.nombre}
                                    </h3>
                                    <div className="flex flex-col items-end gap-2">
                                        <Button
                                            variant="default"
                                            onClick={() => router.push(`/SprintDetails/${sprint._id}`)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow hover:shadow-blue-500/30 transition-all"
                                        >
                                            Ver Tareas
                                        </Button>
                                        <label className="text-sm flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={sprintsSeleccionados.includes(sprint.nombre)}
                                                onChange={() => manejarSeleccionSprint(sprint.nombre)}
                                                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                            />
                                            Seleccionar
                                        </label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-2 space-y-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">Estado:</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${sprint.completado
                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                        : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                        }`}>
                                        {sprint.completado ? 'Completado' : 'Pendiente'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">📝 Tareas pendientes:</span>
                                    <span className="text-muted-foreground">{sprint.tareas ? sprint.tareas.filter((t: any) => !t.completada).length : 0}</span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">📅 Fecha de Inicio:</span>
                                        <span className="text-foreground">{new Date(sprint.fechaInicio).toLocaleDateString('es-ES')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">📅 Fecha de Fin:</span>
                                        <span className="text-foreground">{new Date(sprint.fechaFin).toLocaleDateString('es-ES')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}