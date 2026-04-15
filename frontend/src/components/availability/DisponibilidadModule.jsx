import React, { useEffect, useState } from 'react';
import { Search, Users, CalendarDays, BedDouble } from 'lucide-react';
import {
    buscarDisponibilidadApi,
    obtenerTiposDisponibilidadApi,
} from '../../services/disponibilidadService.js';

const initialForm = {
    fecha_entrada: '',
    fecha_salida: '',
    personas: 1,
    tipo: '',
};

export default function DisponibilidadModule() {
    const [form, setForm] = useState(initialForm);
    const [tipos, setTipos] = useState([]);
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingTipos, setLoadingTipos] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [lastSearch, setLastSearch] = useState(null);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                setLoadingTipos(true);
                const data = await obtenerTiposDisponibilidadApi();
                setTipos(data);
            } catch (err) {
                setError(err.message || 'Error al cargar tipos de habitación');
            } finally {
                setLoadingTipos(false);
            }
        };

        fetchTipos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        setHabitaciones([]);

        try {
            const result = await buscarDisponibilidadApi(form);

            setHabitaciones(result.data || []);
            setLastSearch(result.filtros);

            if ((result.data || []).length === 0) {
                setMessage('No se encontraron habitaciones disponibles con esos criterios');
            } else {
                setMessage(`Se encontraron ${result.total} habitación(es) disponible(s)`);
            }
        } catch (err) {
            setError(err.message || 'Error al buscar disponibilidad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {message && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Disponibilidad</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Busca habitaciones disponibles por fechas, número de personas y tipo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Fecha de entrada
                        </label>
                        <input
                            type="date"
                            name="fecha_entrada"
                            value={form.fecha_entrada}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Fecha de salida
                        </label>
                        <input
                            type="date"
                            name="fecha_salida"
                            value={form.fecha_salida}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Número de personas
                        </label>
                        <input
                            type="number"
                            min="1"
                            name="personas"
                            value={form.personas}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tipo de habitación
                        </label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            disabled={loadingTipos}
                        >
                            <option value="">Todos</option>
                            {tipos.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 xl:col-span-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            <Search className="h-4 w-4" />
                            {loading ? 'Buscando...' : 'Buscar disponibilidad'}
                        </button>
                    </div>
                </form>
            </section>

            {lastSearch && (
                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Resumen de búsqueda</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <CalendarDays className="h-5 w-5 text-slate-700" />
                            <p className="mt-2 text-sm text-slate-500">Entrada</p>
                            <p className="font-semibold text-slate-900">{lastSearch.fecha_entrada}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <CalendarDays className="h-5 w-5 text-slate-700" />
                            <p className="mt-2 text-sm text-slate-500">Salida</p>
                            <p className="font-semibold text-slate-900">{lastSearch.fecha_salida}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <Users className="h-5 w-5 text-slate-700" />
                            <p className="mt-2 text-sm text-slate-500">Personas</p>
                            <p className="font-semibold text-slate-900">{lastSearch.personas}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <BedDouble className="h-5 w-5 text-slate-700" />
                            <p className="mt-2 text-sm text-slate-500">Tipo</p>
                            <p className="font-semibold text-slate-900">{lastSearch.tipo || 'Todos'}</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {habitaciones.map((habitacion) => (
                    <div
                        key={habitacion.id}
                        className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                    >
                        <div className="h-52 w-full bg-slate-200">
                            {habitacion.foto_url ? (
                                <img
                                    src={habitacion.foto_url}
                                    alt={`Habitación ${habitacion.numero}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-100">
                                    <BedDouble className="h-10 w-10 text-slate-400" />
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-500">Habitación</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{habitacion.numero}</h3>
                                    <p className="mt-1 text-sm text-slate-600">{habitacion.tipo}</p>
                                </div>

                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    DISPONIBLE
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                <p>Capacidad: {habitacion.capacidad} persona(s)</p>
                                <p className="font-medium text-slate-900">
                                    Precio base: ${Number(habitacion.precio_base).toFixed(2)}
                                </p>
                                {habitacion.servicios && (
                                    <p>
                                        <span className="font-medium text-slate-800">Servicios:</span> {habitacion.servicios}
                                    </p>
                                )}
                                {habitacion.descripcion && <p>{habitacion.descripcion}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}