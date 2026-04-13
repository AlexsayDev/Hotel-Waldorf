import { Pencil, Power, RefreshCw } from "lucide-react"


const UserTable = ({ users, onEdit, onToggleStatus, loading }) => {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Listado de usuarios</h2>
                    <p className="mt-1 text-sm text-slate-500">Usuarios registrados en el sistema interno del hotel.</p>
                </div>
                <button
                    type="button"
                    onClick={loading}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                </button>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                            <th className="px-3 py-3 font-medium">Usuario</th>
                            <th className="px-3 py-3 font-medium">Correo</th>
                            <th className="px-3 py-3 font-medium">Teléfono</th>
                            <th className="px-3 py-3 font-medium">Rol</th>
                            <th className="px-3 py-3 font-medium">Estado</th>
                            <th className="px-3 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                                    No hay usuarios registrados todavía.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                                    <td className="px-3 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{user.nombre} {user.apellido}</p>
                                            <p className="text-xs text-slate-500">ID: {user.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-slate-700">{user.correo}</td>
                                    <td className="px-3 py-4 text-slate-700">{user.telefono || '—'}</td>
                                    <td className="px-3 py-4">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${user.estado === 'ACTIVO'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                                }`}
                                        >
                                            {user.estado}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(user)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onToggleStatus(user)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                            >
                                                <Power className="h-4 w-4" />
                                                {user.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
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
    )
}

export default UserTable
