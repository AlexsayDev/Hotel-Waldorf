import { pool } from '../config/db.js';

export const buscarHabitacionesDisponibles = async ({
    fechaEntrada,
    fechaSalida,
    personas,
    tipo,
}) => {
    let query = `
        SELECT
        h.id,
        h.numero,
        h.tipo,
        h.capacidad,
        h.precio_base,
        h.estado,
        h.descripcion,
        h.servicios,
        h.foto_url,
        h.creado_en,
        h.actualizado_en
        FROM habitaciones h
        WHERE h.estado = 'ACTIVA'
        AND h.capacidad >= ?
        AND NOT EXISTS (
        SELECT 1
        FROM reservas r
        WHERE r.habitacion_id = h.id
        AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
        AND r.fecha_entrada < ?
        AND r.fecha_salida > ?
        )
    `;

    const params = [personas, fechaSalida, fechaEntrada];

    if (tipo) {
        query += ` AND h.tipo = ?`;
        params.push(tipo);
    }

    query += ` ORDER BY h.numero ASC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

export const obtenerTiposHabitacionDisponibles = async () => {
    const [rows] = await pool.query(`
        SELECT DISTINCT tipo
        FROM habitaciones
        WHERE estado = 'ACTIVA'
        ORDER BY tipo ASC
    `);

    return rows.map((row) => row.tipo);
};