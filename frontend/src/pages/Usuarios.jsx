import React, { useEffect, useMemo, useState } from 'react';
import { Users, LayoutDashboard, BedDouble, Search, CalendarDays, CreditCard, Tags, BarChart3, Settings, RefreshCw, UserPlus, Pencil, Power, ShieldCheck, Mail, Phone, BadgeCheck } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/usuarios';

const modules = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: false },
    { key: 'usuarios', label: 'Usuarios', icon: Users, enabled: true },
    { key: 'habitaciones', label: 'Habitaciones', icon: BedDouble, enabled: false },
    { key: 'disponibilidad', label: 'Disponibilidad', icon: Search, enabled: false },
    { key: 'reservas', label: 'Reservas', icon: CalendarDays, enabled: false },
    { key: 'pagos', label: 'Pagos', icon: CreditCard, enabled: false },
    { key: 'temporadas', label: 'Temporadas', icon: Tags, enabled: false },
    { key: 'reportes', label: 'Reportes', icon: BarChart3, enabled: false },
    { key: 'configuracion', label: 'Configuración', icon: Settings, enabled: false },
];

const initialForm = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'RECEPCIONISTA',
};

function StatCard({ title, value, helper, icon: Icon }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{helper}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeModule, onSelect }) {
    return (
        <aside className="w-full rounded-3xl bg-slate-900 p-5 text-white shadow-xl lg:w-72">
            <div className="mb-8 border-b border-slate-700 pb-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sistema Hotel</p>
                <h1 className="mt-2 text-2xl font-bold">Waldorf Admin</h1>
                <p className="mt-2 text-sm text-slate-400">Panel de gestión del hotel</p>
            </div>

            <nav className="space-y-2">
                {modules.map((module) => {
                    const Icon = module.icon;
                    const isActive = activeModule === module.key;

                    return (
                        <button
                            key={module.key}
                            type="button"
                            onClick={() => onSelect(module.key)}
                            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${isActive
                                    ? 'bg-white text-slate-900'
                                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{module.label}</span>
                            </span>
                            {!module.enabled && (
                                <span className="rounded-full bg-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                                    Próximo
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function UserForm({ form, onChange, onSubmit, loading, editing, onCancel }) {
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
    );
}

function UsersTable({ users, onEdit, onToggleStatus, loading }) {
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
    );
}

function PlaceholderModule({ title, description, icon: Icon }) {
    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-slate-100 p-4">
                    <Icon className="h-7 w-7 text-slate-700" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-slate-500">{description}</p>
                </div>
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                Este módulo está preparado en el sidebar para desarrollarse en las siguientes fases del proyecto.
            </div>
        </div>
    );
}

export default function HotelUsersModule() {
    const [activeModule, setActiveModule] = useState('usuarios');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(initialForm);

    const activeLabel = useMemo(
        () => modules.find((item) => item.key === activeModule)?.label || 'Módulo',
        [activeModule]
    );

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(API_URL);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo obtener la lista de usuarios');
            }

            setUsers(result.data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeModule === 'usuarios') {
            fetchUsers();
        }
    }, [activeModule]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const isEditing = Boolean(editingUser);
            const url = isEditing ? `${API_URL}/${editingUser.id}` : API_URL;
            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                nombre: form.nombre,
                apellido: form.apellido,
                correo: form.correo,
                telefono: form.telefono,
                rol: form.rol,
            };

            if (!isEditing || form.password.trim() !== '') {
                payload.password = form.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo guardar el usuario');
            }

            setMessage(isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
            resetForm();
            fetchUsers();
        } catch (err) {
            setError(err.message || 'Error al guardar usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            correo: user.correo || '',
            password: '',
            telefono: user.telefono || '',
            rol: user.rol || 'RECEPCIONISTA',
        });
        setActiveModule('usuarios');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStatus = async (user) => {
        try {
            setError('');
            setMessage('');

            const nextStatus = user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

            const response = await fetch(`${API_URL}/${user.id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nextStatus }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo cambiar el estado');
            }

            setMessage(`Usuario ${nextStatus === 'ACTIVO' ? 'activado' : 'inactivado'} correctamente`);
            fetchUsers();
        } catch (err) {
            setError(err.message || 'Error al cambiar estado');
        }
    };

    const totalUsuarios = users.length;
    const totalAdmins = users.filter((u) => u.rol === 'ADMIN').length;
    const totalRecepcionistas = users.filter((u) => u.rol === 'RECEPCIONISTA').length;
    const totalActivos = users.filter((u) => u.estado === 'ACTIVO').length;

    const activeModuleConfig = modules.find((m) => m.key === activeModule);

    return (
        <div className="min-h-screen bg-slate-100 p-4 text-slate-900 lg:p-6">
            <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[288px_minmax(0,1fr)]">
                <Sidebar activeModule={activeModule} onSelect={setActiveModule} />

                <main className="space-y-6">
                    <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Módulo actual</p>
                                <h2 className="mt-1 text-3xl font-bold">{activeLabel}</h2>
                                <p className="mt-2 text-slate-500">
                                    Base visual del sistema con navegación preparada para las siguientes fases del proyecto.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
                                Roles iniciales: <span className="font-semibold text-slate-900">ADMIN</span> y{' '}
                                <span className="font-semibold text-slate-900">RECEPCIONISTA</span>
                            </div>
                        </div>
                    </header>

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

                    {activeModule === 'usuarios' ? (
                        <>
                            <section className="grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2">
                                <StatCard title="Total usuarios" value={totalUsuarios} helper="Usuarios registrados" icon={Users} />
                                <StatCard title="Administradores" value={totalAdmins} helper="Con acceso total" icon={ShieldCheck} />
                                <StatCard title="Recepcionistas" value={totalRecepcionistas} helper="Operación diaria" icon={BadgeCheck} />
                                <StatCard title="Usuarios activos" value={totalActivos} helper="Disponibles para ingresar" icon={UserPlus} />
                            </section>

                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                                <UserForm
                                    form={form}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    loading={saving}
                                    editing={Boolean(editingUser)}
                                    onCancel={resetForm}
                                />

                                <div className="space-y-6">
                                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                        <h3 className="text-lg font-semibold text-slate-900">Resumen del perfil operativo</h3>
                                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                                <Mail className="h-5 w-5 text-slate-700" />
                                                <p className="mt-3 text-sm text-slate-500">Correos únicos para cada usuario interno.</p>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                                <Phone className="h-5 w-5 text-slate-700" />
                                                <p className="mt-3 text-sm text-slate-500">Teléfono de contacto para operación y soporte.</p>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                                <ShieldCheck className="h-5 w-5 text-slate-700" />
                                                <p className="mt-3 text-sm text-slate-500">Roles controlados para crecer a permisos por módulo.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <UsersTable
                                        users={users}
                                        onEdit={handleEdit}
                                        onToggleStatus={handleToggleStatus}
                                        loading={fetchUsers}
                                    />
                                </div>
                            </section>
                        </>
                    ) : (
                        <PlaceholderModule
                            title={activeModuleConfig?.label || 'Módulo'}
                            description="Estructura visual preparada para las próximas fases del sistema de reservas del hotel."
                            icon={activeModuleConfig?.icon || LayoutDashboard}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}