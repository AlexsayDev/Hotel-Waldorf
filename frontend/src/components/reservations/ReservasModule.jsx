import React, { useMemo, useState, useEffect } from 'react';
import { CalendarDays, Plus, Search, Ban } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import ReservaForm from './ReservaForm.jsx';
import ReservasTable from './ReservasTable.jsx';
import {
    obtenerReservasApi,
    buscarHabitacionesDisponiblesReservaApi,
    crearReservaApi,
    actualizarReservaApi,
    cancelarReservaApi,
} from '../../services/reservasService.js';

const initialForm = {
    habitacion_id: '',
    nombre_cliente: '',
    apellido_cliente: '',
    correo_cliente: '',
    telefono_cliente: '',
    fecha_entrada: '',
    fecha_salida: '',
    numero_personas: 1,
    tipo_habitacion: '',
    observaciones: '',
};

export default function ReservasModule() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('TODAS');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReserva, setEditingReserva] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [availableRooms, setAvailableRooms] = useState([]);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await obtenerReservasApi();
            setReservas(data);
        } catch (err) {
            setError(err.message || 'Error al cargar reservas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const reservasFiltradas = useMemo(() => {
        return reservas.filter((reserva) => {
            const texto = searchTerm.trim().toLowerCase();

            const coincideTexto =
                !texto ||
                reserva.codigo_reserva.toLowerCase().includes(texto) ||
                `${reserva.nombre_cliente} ${reserva.apellido_cliente}`.toLowerCase().includes(texto) ||
                String(reserva.habitacion_numero).toLowerCase().includes(texto);

            const coincideEstado =
                estadoFiltro === 'TODAS' || reserva.estado === estadoFiltro;

            return coincideTexto && coincideEstado;
        });
    }, [reservas, searchTerm, estadoFiltro]);

    const totalConfirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA').length;
    const totalCanceladas = reservas.filter((r) => r.estado === 'CANCELADA').length;
    const totalPendientes = reservas.filter((r) => r.estado === 'PENDIENTE').length;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingReserva(null);
        setAvailableRooms([]);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleBuscarHabitaciones = async () => {
        try {
            setLoadingRooms(true);
            setError('');
            setMessage('');

            const data = await buscarHabitacionesDisponiblesReservaApi({
                fecha_entrada: form.fecha_entrada,
                fecha_salida: form.fecha_salida,
                numero_personas: form.numero_personas,
                tipo_habitacion: form.tipo_habitacion,
                exclude_reserva_id: editingReserva ? editingReserva.id : '',
            });

            setAvailableRooms(data);

            if (data.length === 0) {
                setMessage('No hay habitaciones disponibles con esos criterios');
            }
        } catch (err) {
            setError(err.message || 'Error al buscar habitaciones');
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                habitacion_id: Number(form.habitacion_id),
                nombre_cliente: form.nombre_cliente,
                apellido_cliente: form.apellido_cliente,
                correo_cliente: form.correo_cliente,
                telefono_cliente: form.telefono_cliente,
                fecha_entrada: form.fecha_entrada,
                fecha_salida: form.fecha_salida,
                numero_personas: Number(form.numero_personas),
                observaciones: form.observaciones,
            };

            if (editingReserva) {
                await actualizarReservaApi(editingReserva.id, payload);
                setMessage('Reserva actualizada correctamente');
            } else {
                await crearReservaApi(payload);
                setMessage('Reserva creada correctamente');
            }

            closeModal();
            fetchReservas();
        } catch (err) {
            setError(err.message || 'Error al guardar la reserva');
        } finally {
            setSaving(false);
        }
    };

    const formatDateForInput = (value) => {
        if (!value) return '';
        return String(value).split('T')[0];
    };

    const handleEdit = (reserva) => {
        setEditingReserva(reserva);
        setForm({
            habitacion_id: reserva.habitacion_id,
            nombre_cliente: reserva.nombre_cliente || '',
            apellido_cliente: reserva.apellido_cliente || '',
            correo_cliente: reserva.correo_cliente || '',
            telefono_cliente: reserva.telefono_cliente || '',
            fecha_entrada: formatDateForInput(reserva.fecha_entrada),
            fecha_salida: formatDateForInput(reserva.fecha_salida),
            numero_personas: reserva.numero_personas,
            tipo_habitacion: reserva.habitacion_tipo || '',
            observaciones: reserva.observaciones || '',
        });

        setAvailableRooms([
            {
                id: reserva.habitacion_id,
                numero: reserva.habitacion_numero,
                tipo: reserva.habitacion_tipo,
                capacidad: reserva.habitacion_capacidad,
                precio_base: reserva.precio_noche,
                foto_url: reserva.habitacion_foto_url,
            },
        ]);

        setIsModalOpen(true);
    };

    const handleCancelReserva = async (reserva) => {
        const confirmado = window.confirm(
            `¿Deseas cancelar la reserva ${reserva.codigo_reserva}?`
        );

        if (!confirmado) return;

        try {
            setError('');
            setMessage('');

            await cancelarReservaApi(reserva.id);
            setMessage('Reserva cancelada correctamente');
            fetchReservas();
        } catch (err) {
            setError(err.message || 'Error al cancelar la reserva');
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

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Confirmadas</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalConfirmadas}</p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Pendientes</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPendientes}</p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Canceladas</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalCanceladas}</p>
                </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Reservas</h2>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva reserva
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Buscar por código, cliente o habitación
                        </label>
                        <div className="flex items-center rounded-2xl border border-slate-300 px-4">
                            <Search className="h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Ej. RES-2026, Andrea, 101"
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Filtrar por estado
                        </label>
                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        >
                            <option value="TODAS">Todas</option>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONFIRMADA">CONFIRMADA</option>
                            <option value="CANCELADA">CANCELADA</option>
                            <option value="FINALIZADA">FINALIZADA</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Mostrando {reservasFiltradas.length} reserva(s)
                </div>
            </section>

            <ReservasTable
                reservas={reservasFiltradas}
                onEdit={handleEdit}
                onCancelReserva={handleCancelReserva}
                onRefresh={fetchReservas}
                loading={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingReserva ? 'Editar reserva' : 'Nueva reserva'}
            >
                <ReservaForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onBuscarHabitaciones={handleBuscarHabitaciones}
                    availableRooms={availableRooms}
                    loadingRooms={loadingRooms}
                    loadingSave={saving}
                    editing={Boolean(editingReserva)}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
}