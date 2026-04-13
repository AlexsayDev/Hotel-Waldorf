import { Pencil, UserPlus } from "lucide-react"


const UserForm = ({ form, onChange, onSubmit, loading, editing, onCancel }) => {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {editing ? 'Editar usuario' : 'Nuevo usuario'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Registra usuarios internos del sistema como administrador o recepcionista.
                    </p>
                </div>
                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancelar edición
                    </button>
                )}
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        placeholder="Ej. Andrea"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Apellido</label>
                    <input
                        name="apellido"
                        value={form.apellido}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        placeholder="Ej. López"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
                    <input
                        name="correo"
                        type="email"
                        value={form.correo}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        placeholder="usuario@hotel.com"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Teléfono</label>
                    <input
                        name="telefono"
                        value={form.telefono}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        placeholder="77770000"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        {editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        placeholder={editing ? 'Dejar vacía para no cambiarla' : '********'}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Rol</label>
                    <select
                        name="rol"
                        value={form.rol}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {editing ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                        {loading ? 'Guardando...' : editing ? 'Actualizar usuario' : 'Crear usuario'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserForm
