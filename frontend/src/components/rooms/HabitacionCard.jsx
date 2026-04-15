import React from 'react';
import { BedDouble, Users, Wrench, Trash2, Pencil } from 'lucide-react';

const getEstadoStyles = (estado) => {
    if (estado === 'ACTIVA') return 'bg-emerald-100 text-emerald-700';
    if (estado === 'MANTENIMIENTO') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
};

export default function HabitacionCard({ habitacion, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
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

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoStyles(habitacion.estado)}`}>
                        {habitacion.estado}
                    </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Capacidad: {habitacion.capacidad} persona(s)
                    </p>
                    <p className="font-medium text-slate-900">
                        Precio base: ${Number(habitacion.precio_base).toFixed(2)}
                    </p>
                    {habitacion.servicios && (
                        <p>
                            <span className="font-medium text-slate-800">Servicios:</span> {habitacion.servicios}
                        </p>
                    )}
                    {habitacion.descripcion && (
                        <p className="line-clamp-3">{habitacion.descripcion}</p>
                    )}
                </div>

                <div className="mt-5 flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(habitacion)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <Pencil className="h-4 w-4" />
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(habitacion)}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}