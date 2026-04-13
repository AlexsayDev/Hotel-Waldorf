import { pool } from '../config/db.js';

const SELECT_BASE = `
    SELECT 
    id,
    nombre,
    apellido,
    correo,
    telefono,
    rol,
    estado,
    creado_en,
    actualizado_en
    FROM usuarios
`;

export const findAll = async () => {
    const [rows] = await pool.query(`${SELECT_BASE} ORDER BY id DESC`);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(`${SELECT_BASE} WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
};

export const findByEmail = async (correo) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
        [correo]
    );
    return rows[0] || null;
};

export const create = async ({ nombre, apellido, correo, password, telefono, rol }) => {
    const [result] = await pool.query(
        `INSERT INTO usuarios (nombre, apellido, correo, password, telefono, rol)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, correo, password, telefono, rol]
    );

    return findById(result.insertId);
};

export const update = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
        fields.push('nombre = ?');
        values.push(data.nombre);
    }

    if (data.apellido !== undefined) {
        fields.push('apellido = ?');
        values.push(data.apellido);
    }

    if (data.correo !== undefined) {
        fields.push('correo = ?');
        values.push(data.correo);
    }

    if (data.telefono !== undefined) {
        fields.push('telefono = ?');
        values.push(data.telefono);
    }

    if (data.rol !== undefined) {
        fields.push('rol = ?');
        values.push(data.rol);
    }

    if (data.password !== undefined) {
        fields.push('password = ?');
        values.push(data.password);
    }

    if (fields.length === 0) {
        return findById(id);
    }

    values.push(id);

    await pool.query(
        `UPDATE usuarios
        SET ${fields.join(', ')}
        WHERE id = ?`,
        values
    );

    return findById(id);
};

export const updateStatus = async (id, estado) => {
    await pool.query(
        'UPDATE usuarios SET estado = ? WHERE id = ?',
        [estado, id]
    );

    return findById(id);
};