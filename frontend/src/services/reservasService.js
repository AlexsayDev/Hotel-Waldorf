const API_URL = 'http://localhost:3000/api/reservas';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const obtenerReservasApi = async () => {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo obtener la lista de reservas');
    }

    return result.data || [];
};

export const buscarHabitacionesDisponiblesReservaApi = async (params) => {
    const searchParams = new URLSearchParams();

    searchParams.append('fecha_entrada', params.fecha_entrada);
    searchParams.append('fecha_salida', params.fecha_salida);
    searchParams.append('personas', params.numero_personas);

    if (params.tipo_habitacion) {
        searchParams.append('tipo', params.tipo_habitacion);
    }

    if (params.exclude_reserva_id) {
        searchParams.append('exclude_reserva_id', params.exclude_reserva_id);
    }

    const response = await fetch(`${API_URL}/disponibles?${searchParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudieron obtener habitaciones disponibles');
    }

    return result.data || [];
};

export const crearReservaApi = async (payload) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo crear la reserva');
    }

    return result;
};

export const actualizarReservaApi = async (id, payload) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo actualizar la reserva');
    }

    return result;
};

export const cancelarReservaApi = async (id) => {
    const response = await fetch(`${API_URL}/${id}/cancelar`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo cancelar la reserva');
    }

    return result;
};