'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavComponte from '@/components/NavBar/navbar';

export default function Progress() {
    const [sprints, setSprints] = useState<any[]>([]);
    const [cantidadSprints, setCantidadSprints] = useState(1);
    const [sprintsSeleccionados, setSprintsSeleccionados] = useState<string[]>([]);

    useEffect(() => {
        const sprintsGuardados = localStorage.getItem('sprints');
        if (sprintsGuardados) {
            setSprints(JSON.parse(sprintsGuardados));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sprints', JSON.stringify(sprints));
    }, [sprints]);

    const agregarSprints = () => {
        const nuevosSprints = [];
        const numeroInicial = sprints.length + 1;

        for (let i = 0; i < cantidadSprints; i++) {
            nuevosSprints.push({
                nombre: `Sprint ${numeroInicial + i}`,
                fechaInicio: '',
                fechaFin: '',
                tareas: [],
                completado: false,
            });
        }

        setSprints([...sprints, ...nuevosSprints]);
        setCantidadSprints(1);
    };

    const calcularProgresoTotal = () => {
        const totalSprints = sprints.length;
        const sprintsCompletados = sprints.filter((s) => s.completado).length;
        return totalSprints === 0 ? 0 : (sprintsCompletados / totalSprints) * 100;
    };

    const manejarSeleccionSprint = (nombre: string) => {
        setSprintsSeleccionados((prev) =>
            prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
        );
    };

    const eliminarSprintsSeleccionados = () => {
        setSprints(sprints.filter((s) => !sprintsSeleccionados.includes(s.nombre)));
        setSprintsSeleccionados([]);
    };

    const manejarCambioFecha = (
        index: number,
        campo: 'fechaInicio' | 'fechaFin',
        valor: string
    ) => {
        const copia = [...sprints];
        if (campo === 'fechaFin' && new Date(valor) < new Date(copia[index].fechaInicio)) {
            alert('La fecha límite no puede ser anterior a la fecha de inicio.');
            return;
        }
        copia[index][campo] = valor;
        setSprints(copia);
    };

    return (
        <div className="container mx-auto p-4" >
            <NavComponte />

            <div className="text-center mt-6 space-y-4">
                <h1 className="text-4xl font-bold text-blue-600">Progreso de Sprints</h1>
                <p className="text-gray-600">Gestiona y visualiza el estado de tus sprints.</p>
            </div>

            <div className="my-6 text-center">
                <p className="text-lg text-blue-600 mb-2">Progreso total</p>
                <div className="w-full bg-gray-200 h-6 rounded overflow-hidden mb-1">
                    <div
                        className="h-full bg-teal-500 transition-all"
                        style={{ width: `${calcularProgresoTotal()}%` }}
                    ></div>
                </div>
                <p className="text-gray-600 text-lg">{Math.round(calcularProgresoTotal())}% Completado</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-6">
                <input
                    type="number"
                    min={1}
                    className="border rounded px-4 py-2 w-48"
                    value={cantidadSprints}
                    onChange={(e) => setCantidadSprints(parseInt(e.target.value))}
                    placeholder="Cantidad de Sprints"
                />
                <Button onClick={agregarSprints}>Agregar Sprints</Button>
                <Button
                    variant="destructive"
                    disabled={sprintsSeleccionados.length === 0}
                    onClick={eliminarSprintsSeleccionados}
                >
                    Eliminar Seleccionados
                </Button>
            </div>

            {sprints.length === 0 ? (
                <p className="text-center text-gray-600">No hay sprints disponibles para mostrar.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sprints.map((sprint, i) => (
                        <Card key={i} className="p-4">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold">{sprint.nombre}</h3>
                                    <div className="flex flex-col items-end gap-2">
                                        <Button
                                            variant="default"
                                        /* onClick={() => router.push(`/sprint/${i}`)} */
                                        >
                                            Ver Tareas
                                        </Button>
                                        <label className="text-sm flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={sprintsSeleccionados.includes(sprint.nombre)}
                                                onChange={() => manejarSeleccionSprint(sprint.nombre)}
                                            />
                                            Seleccionar
                                        </label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-2">
                                    Estado: <span className="font-medium">{sprint.completado ? 'Completado' : 'Pendiente'}</span>
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Fecha de Inicio</p>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full"
                                            value={sprint.fechaInicio}
                                            onChange={(e) => manejarCambioFecha(i, 'fechaInicio', e.target.value)}
                                        />
                                    </div>
                                    {sprint.fechaInicio && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Fecha Límite</p>
                                            <input
                                                type="date"
                                                className="border rounded px-2 py-1 w-full"
                                                value={sprint.fechaFin}
                                                onChange={(e) => manejarCambioFecha(i, 'fechaFin', e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
