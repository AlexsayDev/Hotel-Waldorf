import React from 'react';
import { Pencil, Plus } from 'lucide-react';

export default function HabitacionForm({
    form,
    onChange,
    onSubmit,
    loading,
    editing,
    onCancel,
}) {
    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Número</label>
                <input
                    name="numero"
                    value={form.numero}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="101"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tipo</label>
                <input
                    name="tipo"
                    value={form.tipo}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="Doble, Suite, Familiar..."
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Capacidad</label>
                <input
                    name="capacidad"
                    type="number"
                    min="1"
                    value={form.capacidad}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="2"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Precio base</label>
                <input
                    name="precio_base"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio_base}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="45.00"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Estado</label>
                <select
                    name="estado"
                    value={form.estado}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                >
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                    <option value="INACTIVA">INACTIVA</option>
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">URL de la imagen</label>
                <input
                    name="foto_url"
                    value={form.foto_url}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="https://..."
                />
            </div>

            <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Servicios</label>
                <input
                    name="servicios"
                    value={form.servicios}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="WiFi, TV, Aire acondicionado, Minibar"
                />
            </div>

            <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Descripción</label>
                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={onChange}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="Descripción de la habitación"
                />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                    {editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {loading ? 'Guardando...' : editing ? 'Actualizar habitación' : 'Crear habitación'}
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