import React, { useEffect, useMemo, useState } from 'react';
import { Users, LayoutDashboard, UserPlus, ShieldCheck, Mail, Phone, BadgeCheck } from 'lucide-react';

import Sidebar from '../components/users/Sidebar';
import StatCard from '../components/users/StatCard';
import UserForm from '../components/users/UserForm';
import UsersTable from '../components/users/UserTable';
import PlaceholderModule from '../components/users/PlaceholderModule';
import { modules } from '../data/modules.js';

import { obtenerUsuariosApi, crearUsuarioApi, actualizarUsuarioApi, cambiarEstadoUsuarioApi } from '../services/usuariosService.js';

const initialForm = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'RECEPCIONISTA',
};

const Usuarios = () => {
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

            const data = await obtenerUsuariosApi();
            setUsers(data);
        } catch (error) {
            setError(error.message || 'Error al cargar usuarios');
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
            //const url = isEditing ? `${API_URL}/${editingUser.id}` : API_URL;
            //const method = isEditing ? 'PUT' : 'POST';

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

            /*const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });*/

            if (isEditing) {
                await actualizarUsuarioApi(editingUser.id, payload)
            }else {
                await crearUsuarioApi(payload)
            }

            //const result = await response.json();

            /*if (!response.ok) {
                throw new Error(result.message || 'No se pudo guardar el usuario');
            }*/

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

            await cambiarEstadoUsuarioApi(user.id, nextStatus)

            /*const response = await fetch(`${API_URL}/${user.id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nextStatus }),
            });*/

            //const result = await response.json();

            /*if (!response.ok) {
                throw new Error(result.message || 'No se pudo cambiar el estado');
            }*/

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

export default Usuarios