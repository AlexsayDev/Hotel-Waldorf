import { pool } from '../config/db.js';

const SELECT_BASE = `
    SELECT
    id,
    numero,
    tipo,
    capacidad,
    precio_base,
    estado,
    descripcion,
    servicios,
    foto_url,
    creado_en,
    actualizado_en
    FROM habitaciones
`;

export const findAll = async () => {
    const [rows] = await pool.query(`${SELECT_BASE} ORDER BY numero ASC`);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(`${SELECT_BASE} WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
};

export const findByNumero = async (numero) => {
    const [rows] = await pool.query(
        'SELECT * FROM habitaciones WHERE numero = ? LIMIT 1',
        [numero]
    );
    return rows[0] || null;
};

export const create = async ({
    numero,
    tipo,
    capacidad,
    precio_base,
    estado,
    descripcion,
    servicios,
    foto_url,
}) => {
    const [result] = await pool.query(
        `INSERT INTO habitaciones
        (numero, tipo, capacidad, precio_base, estado, descripcion, servicios, foto_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [numero, tipo, capacidad, precio_base, estado, descripcion, servicios, foto_url]
    );

    return findById(result.insertId);
};

export const update = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.numero !== undefined) {
        fields.push('numero = ?');
        values.push(data.numero);
    }

    if (data.tipo !== undefined) {
        fields.push('tipo = ?');
        values.push(data.tipo);
    }

    if (data.capacidad !== undefined) {
        fields.push('capacidad = ?');
        values.push(data.capacidad);
    }

    if (data.precio_base !== undefined) {
        fields.push('precio_base = ?');
        values.push(data.precio_base);
    }

    if (data.estado !== undefined) {
        fields.push('estado = ?');
        values.push(data.estado);
    }

    if (data.descripcion !== undefined) {
        fields.push('descripcion = ?');
        values.push(data.descripcion);
    }

    if (data.servicios !== undefined) {
        fields.push('servicios = ?');
        values.push(data.servicios);
    }

    if (data.foto_url !== undefined) {
        fields.push('foto_url = ?');
        values.push(data.foto_url);
    }

    if (fields.length === 0) {
        return findById(id);
    }

    values.push(id);

    await pool.query(
        `UPDATE habitaciones
        SET ${fields.join(', ')}
        WHERE id = ?`,
        values
    );

    return findById(id);
};

export const remove = async (id) => {
    await pool.query('DELETE FROM habitaciones WHERE id = ?', [id]);
};