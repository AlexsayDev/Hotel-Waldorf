import React, { useState } from 'react';
import { LockKeyhole, Mail, LogIn } from 'lucide-react';
import { loginApi } from '../services/authService.js';

const initialForm = {
    correo: '',
    password: '',
};

export default function Login({ onLoginSuccess }) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await loginApi(form);
            onLoginSuccess(result.token, result.user);
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                        Sistema Hotel
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Iniciar sesión
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Acceso administrativo al sistema de reservas
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Correo
                        </label>
                        <div className="flex items-center rounded-2xl border border-slate-300 px-4">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <input
                                type="email"
                                name="correo"
                                value={form.correo}
                                onChange={handleChange}
                                placeholder="admin@hotel.com"
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Contraseña
                        </label>
                        <div className="flex items-center rounded-2xl border border-slate-300 px-4">
                            <LockKeyhole className="h-4 w-4 text-slate-500" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="********"
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogIn className="h-4 w-4" />
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}