const API_URL = 'http://localhost:3000/api/auth';

export const loginApi = async (payload) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo iniciar sesión');
    }

    return result;
};

export const meApi = async (token) => {
    const response = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo obtener la sesión');
    }

    return result.user;
};