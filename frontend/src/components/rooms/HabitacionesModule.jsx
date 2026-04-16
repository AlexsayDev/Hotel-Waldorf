import React, { useEffect, useMemo, useState } from 'react';
import { BedDouble, Wrench, Ban, Plus, Search, Filter } from 'lucide-react';
import HabitacionForm from './HabitacionForm.jsx';
import HabitacionCard from './HabitacionCard.jsx';
import {
    obtenerHabitacionesApi,
    crearHabitacionApi,
    actualizarHabitacionApi,
    eliminarHabitacionApi,
} from '../../services/habitacionesService.js';
import Modal from '../ui/Modal.jsx';

const initialForm = {
    numero: '',
    tipo: '',
    capacidad: '',
    precio_base: '',
    estado: 'ACTIVA',
    descripcion: '',
    servicios: '',
    foto_url: '',
};

export default function HabitacionesModule() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingHabitacion, setEditingHabitacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchNumero, setSearchNumero] = useState('');
    const [filterEstado, setFilterEstado] = useState('TODOS');
    const [filterTipo, setFilterTipo] = useState('TODOS');

    const fetchHabitaciones = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await obtenerHabitacionesApi();
            setHabitaciones(data);
        } catch (err) {
            setError(err.message || 'Error al cargar habitaciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabitaciones();
    }, []);

    const tiposDisponibles = useMemo(() => {
        return [...new Set(habitaciones.map((h) => h.tipo).filter(Boolean))];
    }, [habitaciones]);

    const habitacionesFiltradas = useMemo(() => {
        return habitaciones.filter((habitacion) => {
            const coincideNumero = habitacion.numero
            .toLowerCase()
            .includes(searchNumero.trim().toLocaleLowerCase());

            const coincideEstado = filterEstado === 'TODOS' || habitacion.estado === filterEstado;

            const coincideTipo = filterTipo === 'TODOS' ||habitacion.tipo === filterTipo;

            return coincideNumero && coincideEstado && coincideTipo;
        });
    }, [habitaciones, searchNumero, filterEstado, filterTipo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingHabitacion(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const payload = {
                numero: form.numero,
                tipo: form.tipo,
                capacidad: Number(form.capacidad),
                precio_base: Number(form.precio_base),
                estado: form.estado,
                descripcion: form.descripcion,
                servicios: form.servicios,
                foto_url: form.foto_url,
            };

            if (editingHabitacion) {
                await actualizarHabitacionApi(editingHabitacion.id, payload);
                setMessage('Habitación actualizada correctamente');
            } else {
                await crearHabitacionApi(payload);
                setMessage('Habitación creada correctamente');
            }

            closeModal();
            fetchHabitaciones();

            resetForm();
            fetchHabitaciones();
        } catch (err) {
            setError(err.message || 'Error al guardar habitación');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (habitacion) => {
        setEditingHabitacion(habitacion);
        setForm({
            numero: habitacion.numero || '',
            tipo: habitacion.tipo || '',
            capacidad: habitacion.capacidad || '',
            precio_base: habitacion.precio_base || '',
            estado: habitacion.estado || 'ACTIVA',
            descripcion: habitacion.descripcion || '',
            servicios: habitacion.servicios || '',
            foto_url: habitacion.foto_url || '',
        });
        setIsModalOpen(true);
        //window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (habitacion) => {
        const confirmado = window.confirm(
            `¿Deseas eliminar la habitación ${habitacion.numero}?`
        );

        if (!confirmado) return;

        try {
            setError('');
            setMessage('');

            await eliminarHabitacionApi(habitacion.id);
            setMessage('Habitación eliminada correctamente');
            fetchHabitaciones();
        } catch (err) {
            setError(err.message || 'Error al eliminar habitación');
        }
    };

    const limpiarFiltros = () => {
        setSearchNumero('');
        setFilterEstado('TODOS');
        setFilterTipo('TODOS');
    }

    const totalActivas = habitaciones.filter((h) => h.estado === 'ACTIVA').length;
    const totalMantenimiento = habitaciones.filter((h) => h.estado === 'MANTENIMIENTO').length;
    const totalInactivas = habitaciones.filter((h) => h.estado === 'INACTIVA').length;

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

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                        <BedDouble className="h-5 w-5 text-slate-700" />
                        <div>
                            <p className="text-sm text-slate-500">Activas</p>
                            <p className="text-2xl font-bold text-slate-900">{totalActivas}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-amber-600" />
                        <div>
                            <p className="text-sm text-slate-500">Mantenimiento</p>
                            <p className="text-2xl font-bold text-slate-900">{totalMantenimiento}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                        <Ban className="h-5 w-5 text-rose-600" />
                        <div>
                            <p className="text-sm text-slate-500">Inactivas</p>
                            <p className="text-2xl font-bold text-slate-900">{totalInactivas}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Habitaciones</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={fetchHabitaciones}
                            disabled={loading}
                            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            {loading ? 'Actualizando...' : 'Actualizar'}
                        </button>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva habitación
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="xl:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Buscar por número
                        </label>
                        <div className="flex items-center rounded-2xl border border-slate-300 px-4">
                            <Search className="h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchNumero}
                                onChange={(e) => setSearchNumero(e.target.value)}
                                placeholder="Ej. 101"
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Filtrar por estado
                        </label>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="ACTIVA">ACTIVA</option>
                            <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                            <option value="INACTIVA">INACTIVA</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Filtrar por tipo
                        </label>
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        >
                            <option value="TODOS">Todos</option>
                            {tiposDisponibles.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                        Mostrando <span className="font-semibold text-slate-900">{habitacionesFiltradas.length}</span> habitación(es)
                    </p>

                    <button
                        type="button"
                        onClick={limpiarFiltros}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <Filter className="h-4 w-4" />
                        Limpiar filtros
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {habitacionesFiltradas.length === 0 ? (
                    <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
                        No hay habitaciones que coincidan con la búsqueda o los filtros.
                    </div>
                ) : (
                    habitacionesFiltradas.map((habitacion) => (
                        <HabitacionCard
                            key={habitacion.id}
                            habitacion={habitacion}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingHabitacion ? 'Editar habitación' : 'Nueva habitación'}
            >
                <HabitacionForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={saving}
                    editing={Boolean(editingHabitacion)}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
}