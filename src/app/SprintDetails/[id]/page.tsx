'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import {
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';

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
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-xl rounded-lg">
            <button
                onClick={() => router.push(`/Progress/${sprint?.proyectoId}`)}
                className="text-blue-500 hover:underline text-sm mb-4"
            >
                ← Volver a Progreso
            </button>

            <h2 className="text-4xl font-bold text-gray-800 mb-1">{sprint?.nombre}</h2>
            <p className="text-gray-500 mb-6">🗂️ Gestión de tareas del sprint</p>

            {/* Formulario de tareas */}
            {!sprint?.completado && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-10 shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-6">{editando ? '✏️ Editar Tarea' : '📝 Nueva Tarea'}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre de la tarea"
                            value={nombreTarea}
                            onChange={(e) => setNombreTarea(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Rol asignado"
                            value={rolTarea}
                            onChange={(e) => setRolTarea(e.target.value)}
                        />
                        <textarea
                            className="border border-gray-300 p-3 rounded-lg md:col-span-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descripción"
                            value={descripcionTarea}
                            onChange={(e) => setDescripcionTarea(e.target.value)}
                        />
                        <input
                            type="date"
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={fechaFinalizacion}
                            onChange={(e) => setFechaFinalizacion(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                    >
                        {editando ? 'Actualizar Tarea' : 'Agregar Tarea'}
                    </button>
                </div>
            )}

            {/* Lista de tareas */}
            <div className="space-y-4">
                {tareas.map((tarea, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-5 rounded-lg shadow-md border flex justify-between items-start transition hover:shadow-lg"
                    >
                        <div>
                            <p className="text-xl font-semibold text-gray-800">{tarea.nombre}</p>
                            <p className="text-gray-600 mt-1">📄 {tarea.descripcion}</p>
                            <div className="flex gap-3 text-sm text-gray-500 mt-2">
                                <span>📅 {tarea.fecha}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tarea.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : tarea.estado === 'Urgente' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
                                    {tarea.estado}
                                </span>
                                <span>👤 {tarea.rol}</span>
                            </div>
                        </div>
                        {!sprint?.completado && (
                            <div className="flex gap-2 mt-1">
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    disabled={tarea.completada}
                                    onClick={() => completarTarea(idx)}
                                    title="Completar"
                                >
                                    <CheckCircleIcon className="h-6 w-6" />
                                </button>
                                <button
                                    className="text-yellow-600 hover:text-yellow-800"
                                    onClick={() => editarTarea(idx)}
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="h-6 w-6" />
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => borrarTarea(idx)}
                                    title="Eliminar"
                                >
                                    <TrashIcon className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className="bg-purple-700 text-white px-6 py-3 rounded-lg mt-10 w-full disabled:opacity-50 hover:bg-purple-800 transition"
                disabled={!todasTareasCompletas || tareas.length === 0 || sprint?.completado}
                onClick={completarSprint}
            >
                ✅ Completar Sprint
            </button>
        </div>
    );
}
