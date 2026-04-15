const API_URL = 'http://localhost:3000/api/disponibilidad';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const buscarDisponibilidadApi = async (params) => {
    const searchParams = new URLSearchParams();

    searchParams.append('fecha_entrada', params.fecha_entrada);
    searchParams.append('fecha_salida', params.fecha_salida);
    searchParams.append('personas', params.personas);

    if (params.tipo) {
        searchParams.append('tipo', params.tipo);
    }

    const response = await fetch(`${API_URL}/buscar?${searchParams.toString()}`, {
        headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo consultar la disponibilidad');
    }

    return result;
};

export const obtenerTiposDisponibilidadApi = async () => {
    const response = await fetch(`${API_URL}/tipos`, {
        headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'No se pudieron obtener los tipos');
    }

    return result.data || [];
};