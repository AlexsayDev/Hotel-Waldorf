import React from 'react';
import { Pencil, Ban } from 'lucide-react';

const getEstadoStyles = (estado) => {
    if (estado === 'CONFIRMADA') return 'bg-emerald-100 text-emerald-700';
    if (estado === 'PENDIENTE') return 'bg-amber-100 text-amber-700';
    if (estado === 'FINALIZADA') return 'bg-slate-200 text-slate-700';
    return 'bg-rose-100 text-rose-700';
};

export default function ReservasTable({
    reservas,
    onEdit,
    onCancelReserva,
    onRefresh,
    loading,
}) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Listado de reservas</h2>
                    <p className="mt-1 text-sm text-slate-500">Reservas registradas en el sistema.</p>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                            <th className="px-3 py-3 font-medium">Código</th>
                            <th className="px-3 py-3 font-medium">Cliente</th>
                            <th className="px-3 py-3 font-medium">Habitación</th>
                            <th className="px-3 py-3 font-medium">Fechas</th>
                            <th className="px-3 py-3 font-medium">Total</th>
                            <th className="px-3 py-3 font-medium">Estado</th>
                            <th className="px-3 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                                    No hay reservas registradas todavía.
                                </td>
                            </tr>
                        ) : (
                            reservas.map((reserva) => (
                                <tr key={reserva.id} className="border-b border-slate-100 last:border-b-0">
                                    <td className="px-3 py-4">
                                        <p className="font-semibold text-slate-900">{reserva.codigo_reserva}</p>
                                    </td>

                                    <td className="px-3 py-4">
                                        <p className="font-semibold text-slate-900">
                                            {reserva.nombre_cliente} {reserva.apellido_cliente}
                                        </p>
                                        <p className="text-xs text-slate-500">{reserva.correo_cliente || 'Sin correo'}</p>
                                    </td>

                                    <td className="px-3 py-4">
                                        <p className="font-semibold text-slate-900">{reserva.habitacion_numero}</p>
                                        <p className="text-xs text-slate-500">{reserva.habitacion_tipo}</p>
                                    </td>

                                    <td className="px-3 py-4 text-slate-700">
                                        <p>{reserva.fecha_entrada}</p>
                                        <p className="text-xs text-slate-500">al {reserva.fecha_salida}</p>
                                    </td>

                                    <td className="px-3 py-4 font-semibold text-slate-900">
                                        ${Number(reserva.total_estancia).toFixed(2)}
                                    </td>

                                    <td className="px-3 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoStyles(reserva.estado)}`}>
                                            {reserva.estado}
                                        </span>
                                    </td>

                                    <td className="px-3 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(reserva)}
                                                disabled={reserva.estado === 'CANCELADA' || reserva.estado === 'FINALIZADA'}
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onCancelReserva(reserva)}
                                                disabled={reserva.estado === 'CANCELADA'}
                                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                                            >
                                                <Ban className="h-4 w-4" />
                                                Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}