'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import {
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';
import NavComponentProgress from '@/components/NavBar/navbarprogress';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SprintDetalle() {
    const router = useRouter();
    const params = useParams();
    const sprintId = params?.id;

    const [sprint, setSprint] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [nombreTarea, setNombreTarea] = useState('');
    const [descripcionTarea, setDescripcionTarea] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');
    const [estadoTarea, setEstadoTarea] = useState('Pendiente');
    const [rolTarea, setRolTarea] = useState('');
    const [editando, setEditando] = useState(false);
    const [indiceTareaEditando, setIndiceTareaEditando] = useState(null);

    useEffect(() => {
        if (sprintId) {
            axios.get(`${API_URL}/api/sprints/${sprintId}`).then(res => {
                setSprint(res.data);
                setTareas(res.data.tareas || []);
            });
        }
    }, [sprintId]);

    const guardarTareas = async (nuevasTareas) => {
        setTareas(nuevasTareas);
        await axios.put(`${API_URL}/api/sprints/${sprintId}`, {
            ...sprint,
            tareas: nuevasTareas,
        });
    };

    const agregarTarea = async () => {
        const nuevasTareas = editando
            ? tareas.map((t, idx) =>
                idx === indiceTareaEditando
                    ? { ...t, nombre: nombreTarea, descripcion: descripcionTarea, fecha: fechaFinalizacion, estado: estadoTarea, rol: rolTarea, completada: false }
                    : t
            )
            : [
                ...tareas,
                { nombre: nombreTarea, descripcion: descripcionTarea, fecha: fechaFinalizacion, estado: estadoTarea, rol: rolTarea, completada: false },
            ];

        await guardarTareas(nuevasTareas);
        setNombreTarea('');
        setDescripcionTarea('');
        setFechaFinalizacion('');
        setEstadoTarea('Pendiente');
        setRolTarea('');
        setEditando(false);
        setIndiceTareaEditando(null);
    };

    const completarTarea = async (idx) => {
        const nuevasTareas = tareas.map((t, i) =>
            i === idx ? { ...t, estado: 'Finalizado', completada: true } : t
        );
        await guardarTareas(nuevasTareas);
    };

    const borrarTarea = async (idx) => {
        const nuevasTareas = tareas.filter((_, i) => i !== idx);
        await guardarTareas(nuevasTareas);
    };

    const editarTarea = (idx) => {
        const tarea = tareas[idx];
        setNombreTarea(tarea.nombre);
        setDescripcionTarea(tarea.descripcion);
        setFechaFinalizacion(tarea.fecha);
        setEstadoTarea(tarea.estado);
        setRolTarea(tarea.rol);
        setEditando(true);
        setIndiceTareaEditando(idx);
    };

    const completarSprint = async () => {
        await axios.put(`${API_URL}/api/sprints/${sprintId}`, {
            ...sprint,
            completado: true,
        });
        setSprint(prev => ({ ...prev, completado: true }));
    };

    const todasTareasCompletas = tareas.length > 0 && tareas.every(t => t.completada);

    return (
        <div className="min-h-screen bg-background text-foreground max-w-4xl mx-auto px-6 py-10">

            <div className="flex justify-center">
                <NavComponentProgress />
            </div>


            <div className="text-center mt-6 space-y-4">
                <button
                    onClick={() => router.push(`/Progress/${sprint?.proyectoId}`)}
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mb-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a Progreso
                </button>
            </div>


            <div className="mb-10">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    {sprint?.nombre}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                    <span className="text-xl">🗂️</span>
                    <span>Gestión de tareas del sprint</span>
                </p>
            </div>

            {/* Formulario de tareas */}
            {!sprint?.completado && (
                <div className="bg-card border border-border/50 p-6 rounded-lg mb-10 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        {editando ? (
                            <>
                                <span className="text-primary">✏️</span>
                                <span>Editar Tarea</span>
                            </>
                        ) : (
                            <>
                                <span className="text-primary">📝</span>
                                <span>Nueva Tarea</span>
                            </>
                        )}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            className="border border-border bg-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Nombre de la tarea"
                            value={nombreTarea}
                            onChange={(e) => setNombreTarea(e.target.value)}
                        />
                        <input
                            className="border border-border bg-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Rol asignado"
                            value={rolTarea}
                            onChange={(e) => setRolTarea(e.target.value)}
                        />
                        <textarea
                            className="border border-border bg-input p-3 rounded-lg md:col-span-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Descripción"
                            value={descripcionTarea}
                            onChange={(e) => setDescripcionTarea(e.target.value)}
                            rows={3}
                        />
                        <input
                            type="date"
                            className="border border-border bg-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={fechaFinalizacion}
                            onChange={(e) => setFechaFinalizacion(e.target.value)}
                        />
                        <select
                            className="border border-border bg-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={estadoTarea}
                            onChange={(e) => setEstadoTarea(e.target.value)}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En progreso">En Progreso</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>

                    <button
                        onClick={agregarTarea}
                        className="mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-6 py-3 rounded-lg transition-all shadow hover:shadow-primary/30"
                    >
                        {editando ? 'Actualizar Tarea' : 'Agregar Tarea'}
                    </button>
                </div>
            )}

            {/* Lista de tareas */}
            <div className="space-y-4">
                {tareas.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No hay tareas en este sprint
                        </p>
                    </div>
                ) : (
                    tareas.map((tarea, idx) => (
                        <div
                            key={idx}
                            className="bg-card border border-border/50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all flex justify-between items-start group"
                        >
                            <div>
                                <p className="text-xl font-semibold group-hover:text-primary/80 transition-colors">
                                    {tarea.nombre}
                                </p>
                                <p className="text-muted-foreground mt-1">📄 {tarea.descripcion}</p>
                                <div className="flex flex-wrap gap-3 text-sm mt-2">
                                    <span className="text-muted-foreground">📅 {tarea.fecha}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tarea.estado === 'Pendiente'
                                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                        : tarea.estado === 'Urgente'
                                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                                            : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                        }`}>
                                        {tarea.estado}
                                    </span>
                                    <span className="text-muted-foreground">👤 {tarea.rol}</span>
                                </div>
                            </div>
                            {!sprint?.completado && (
                                <div className="flex gap-2 mt-1">
                                    <button
                                        className="text-green-500 hover:text-green-700 transition-colors"
                                        disabled={tarea.completada}
                                        onClick={() => completarTarea(idx)}
                                        title="Completar"
                                    >
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        className="text-yellow-500 hover:text-yellow-700 transition-colors"
                                        onClick={() => editarTarea(idx)}
                                        title="Editar"
                                    >
                                        <PencilSquareIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        onClick={() => borrarTarea(idx)}
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {tareas.length > 0 && (
                <button
                    className={`mt-10 w-full py-3 rounded-lg transition-all shadow-lg ${!todasTareasCompletas || sprint?.completado
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:shadow-purple-500/30'
                        }`}
                    disabled={!todasTareasCompletas || sprint?.completado}
                    onClick={completarSprint}
                >
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Completar Sprint</span>
                    </div>
                </button>
            )}
        </div>
    );
}