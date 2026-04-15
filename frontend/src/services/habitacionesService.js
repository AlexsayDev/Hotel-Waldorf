const API_URL = 'http://localhost:3000/api/habitaciones';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const obtenerHabitacionesApi = async () => {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo obtener la lista de habitaciones');
    }

    return result.data || [];
};

export const crearHabitacionApi = async (payload) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo crear la habitación');
    }

    return result;
};

export const actualizarHabitacionApi = async (id, payload) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo actualizar la habitación');
    }

    return result;
};

export const eliminarHabitacionApi = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo eliminar la habitación');
    }

    return result;
};