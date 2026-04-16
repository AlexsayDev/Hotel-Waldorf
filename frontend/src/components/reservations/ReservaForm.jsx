import React, { useMemo } from 'react';
import { Search, BedDouble } from 'lucide-react';

const calcularNoches = (fechaEntrada, fechaSalida) => {
    if (!fechaEntrada || !fechaSalida) return 0;

    const entrada = new Date(`${fechaEntrada}T00:00:00`);
    const salida = new Date(`${fechaSalida}T00:00:00`);
    const diff = salida - entrada;

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function ReservaForm({
    form,
    onChange,
    onSubmit,
    onBuscarHabitaciones,
    availableRooms,
    loadingRooms,
    loadingSave,
    editing,
    onCancel,
}) {
    const selectedRoom = useMemo(() => {
        return availableRooms.find((room) => Number(room.id) === Number(form.habitacion_id));
    }, [availableRooms, form.habitacion_id]);

    const noches = calcularNoches(form.fecha_entrada, form.fecha_salida);
    const total = selectedRoom ? Number(selectedRoom.precio_base) * noches : 0;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nombre del cliente</label>
                    <input
                        name="nombre_cliente"
                        value={form.nombre_cliente}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        placeholder="William"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Apellido del cliente</label>
                    <input
                        name="apellido_cliente"
                        value={form.apellido_cliente}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        placeholder="Zavala"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
                    <input
                        name="correo_cliente"
                        type="email"
                        value={form.correo_cliente}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        placeholder="william@gmail.com"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Teléfono</label>
                    <input
                        name="telefono_cliente"
                        value={form.telefono_cliente}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        placeholder="77770000"
                    />
                </div>
            </section>

            <section className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Buscar habitación disponible</h3>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Fecha de entrada</label>
                        <input
                            type="date"
                            name="fecha_entrada"
                            value={form.fecha_entrada}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Fecha de salida</label>
                        <input
                            type="date"
                            name="fecha_salida"
                            value={form.fecha_salida}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Número de personas</label>
                        <input
                            type="number"
                            min="1"
                            name="numero_personas"
                            value={form.numero_personas}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de habitación</label>
                        <input
                            name="tipo_habitacion"
                            value={form.tipo_habitacion}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onBuscarHabitaciones}
                        disabled={loadingRooms}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-60"
                    >
                        <Search className="h-4 w-4" />
                        {loadingRooms ? 'Buscando...' : 'Buscar habitaciones'}
                    </button>
                </div>

                <div className="mt-5 space-y-3">
                    {availableRooms.length === 0 ? (
                        <div className="rounded-2xl bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-200">
                            Aún no hay habitaciones cargadas para seleccionar.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {availableRooms.map((room) => {
                                const isSelected = Number(form.habitacion_id) === Number(room.id);

                                return (
                                    <button
                                        key={room.id}
                                        type="button"
                                        onClick={() =>
                                            onChange({
                                                target: {
                                                    name: 'habitacion_id',
                                                    value: room.id,
                                                },
                                            })
                                        }
                                        className={`rounded-3xl border p-4 text-left transition ${isSelected
                                                ? 'border-slate-900 bg-slate-900 text-white'
                                                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-2xl bg-slate-100 p-3">
                                                <BedDouble className="h-5 w-5 text-slate-700" />
                                            </div>

                                            <div className="flex-1">
                                                <p className={`text-sm ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                                                    Habitación
                                                </p>
                                                <p className="text-xl font-bold">{room.numero}</p>
                                                <p className={`text-sm ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                                    {room.tipo} · Capacidad {room.capacidad}
                                                </p>
                                                <p className="mt-2 font-semibold">
                                                    Precio por noche: ${Number(room.precio_base).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Observaciones</label>
                    <textarea
                        name="observaciones"
                        rows="4"
                        value={form.observaciones}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        placeholder="Notas de la reserva"
                    />
                </div>
            </section>

            <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Resumen</h3>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">Noches</p>
                        <p className="text-2xl font-bold text-slate-900">{noches}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">Precio por noche</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${selectedRoom ? Number(selectedRoom.precio_base).toFixed(2) : '0.00'}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-sm text-slate-500">Total estimado</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${Number(total).toFixed(2)}
                        </p>
                    </div>
                </div>
            </section>

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={loadingSave}
                    className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                    {loadingSave
                        ? 'Guardando...'
                        : editing
                            ? 'Actualizar reserva'
                            : 'Crear reserva'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}