// Logica de llamadas al backend
const API_URL = 'http://localhost:3000/api/usuarios';

export const obtenerUsuariosApi = async () => {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo obtener la lista de usuarios');
    }

    return result.data || [];
};

export const crearUsuarioApi = async (payload) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo guardar el usuario');
    }

    return result;
};

export const actualizarUsuarioApi = async (id, payload) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo guardar el usuario');
    }

    return result;
};

export const cambiarEstadoUsuarioApi = async (id, estado) => {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo cambiar el estado');
    }

    return result;
};