import { pool } from '../config/db.js';

const SELECT_BASE = `
    SELECT
    r.id,
    r.codigo_reserva,
    r.habitacion_id,
    r.nombre_cliente,
    r.apellido_cliente,
    r.correo_cliente,
    r.telefono_cliente,
    r.fecha_entrada,
    r.fecha_salida,
    r.numero_personas,
    r.precio_noche,
    r.total_estancia,
    r.observaciones,
    r.estado,
    r.cancelado_en,
    r.creado_en,
    r.actualizado_en,
    h.numero AS habitacion_numero,
    h.tipo AS habitacion_tipo,
    h.capacidad AS habitacion_capacidad,
    h.foto_url AS habitacion_foto_url
    FROM reservas r
    INNER JOIN habitaciones h ON h.id = r.habitacion_id
`;

export const findAll = async () => {
    const [rows] = await pool.query(`${SELECT_BASE} ORDER BY r.id DESC`);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(`${SELECT_BASE} WHERE r.id = ? LIMIT 1`, [id]);
    return rows[0] || null;
};

export const findHabitacionById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT
        id,
        numero,
        tipo,
        capacidad,
        precio_base,
        estado,
        descripcion,
        servicios,
        foto_url
        FROM habitaciones
        WHERE id = ?
        LIMIT 1
    `,
        [id]
    );

    return rows[0] || null;
};

export const findConflictingReserva = async ({
    habitacionId,
    fechaEntrada,
    fechaSalida,
    excludeReservaId = null,
}) => {
    let query = `
    SELECT id
    FROM reservas
    WHERE habitacion_id = ?
    AND estado IN ('PENDIENTE', 'CONFIRMADA')
    AND fecha_entrada < ?
    AND fecha_salida > ?
    `;

    const params = [habitacionId, fechaSalida, fechaEntrada];

    if (excludeReservaId) {
        query += ` AND id <> ?`;
        params.push(excludeReservaId);
    }

    query += ` LIMIT 1`;

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
};

export const findAvailableRoomsForReserva = async ({
    fechaEntrada,
    fechaSalida,
    personas,
    tipo,
    excludeReservaId = null,
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
        h.foto_url
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
    `;

    const params = [personas, fechaSalida, fechaEntrada];

    if (excludeReservaId) {
        query += ` AND r.id <> ?`;
        params.push(excludeReservaId);
    }

    query += ` )`;

    if (tipo) {
        query += ` AND h.tipo = ?`;
        params.push(tipo);
    }

    query += ` ORDER BY h.numero ASC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

export const create = async ({
    codigo_reserva,
    habitacion_id,
    nombre_cliente,
    apellido_cliente,
    correo_cliente,
    telefono_cliente,
    fecha_entrada,
    fecha_salida,
    numero_personas,
    precio_noche,
    total_estancia,
    observaciones,
}) => {
    const [result] = await pool.query(
        `
        INSERT INTO reservas (
        codigo_reserva,
        habitacion_id,
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        telefono_cliente,
        fecha_entrada,
        fecha_salida,
        numero_personas,
        precio_noche,
        total_estancia,
        observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
            codigo_reserva,
            habitacion_id,
            nombre_cliente,
            apellido_cliente,
            correo_cliente,
            telefono_cliente,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            precio_noche,
            total_estancia,
            observaciones,
        ]
    );

    return findById(result.insertId);
};

export const update = async (id, data) => {
    await pool.query(
        `
        UPDATE reservas
        SET
        habitacion_id = ?,
        nombre_cliente = ?,
        apellido_cliente = ?,
        correo_cliente = ?,
        telefono_cliente = ?,
        fecha_entrada = ?,
        fecha_salida = ?,
        numero_personas = ?,
        precio_noche = ?,
        total_estancia = ?,
        observaciones = ?
        WHERE id = ?
    `,
        [
            data.habitacion_id,
            data.nombre_cliente,
            data.apellido_cliente,
            data.correo_cliente,
            data.telefono_cliente,
            data.fecha_entrada,
            data.fecha_salida,
            data.numero_personas,
            data.precio_noche,
            data.total_estancia,
            data.observaciones,
            id,
        ]
    );

    return findById(id);
};

export const cancel = async (id) => {
    await pool.query(
        `
        UPDATE reservas
        SET
        estado = 'CANCELADA',
        cancelado_en = NOW()
        WHERE id = ?
    `,
        [id]
    );

    return findById(id);
};