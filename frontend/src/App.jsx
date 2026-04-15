import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Usuarios from './pages/Usuarios.jsx';
import { meApi } from './services/authService.js';

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            if (!token) {
                setCheckingSession(false);
                return;
            }

            try {
                const usuario = await meApi(token);
                setUser(usuario);
            } catch {
                localStorage.removeItem('token');
                setToken('');
                setUser(null);
            } finally {
                setCheckingSession(false);
            }
        };

        loadSession();
    }, [token]);

    const handleLoginSuccess = (newToken, usuario) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(usuario);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    if (checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-2xl bg-white px-6 py-4 text-slate-700 shadow-sm ring-1 ring-slate-200">
                    Cargando sesión...
                </div>
            </div>
        );
    }

    if (!token || !user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleLogout}
                className="fixed right-4 top-4 z-50 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
                Cerrar sesión
            </button>

            <Usuarios />
        </div>
    );
}