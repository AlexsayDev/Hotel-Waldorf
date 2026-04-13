import { hash } from 'bcryptjs';
import { findAll, findById, findByEmail, create, update, updateStatus } from '../models/usuarios.model.js';

const ROLES_VALIDOS = ['ADMIN', 'RECEPCIONISTA'];
const ESTADOS_VALIDOS = ['ACTIVO', 'INACTIVO'];

const esIdValido = (id) => {
    return Number.isInteger(Number(id)) && Number(id) > 0;
};

export const obtenerUsuarios = async (req, res, next) => {
    try {
        const usuarios = await findAll();

        res.json({
            ok: true,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuario = await findById(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
};

export const crearUsuario = async (req, res, next) => {
    try {
        let { nombre, apellido, correo, password, telefono, rol } = req.body;

        if (!nombre || !apellido || !correo || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Nombre, apellido, correo y password son obligatorios'
            });
        }

        correo = correo.trim().toLowerCase();
        rol = (rol || 'RECEPCIONISTA').trim().toUpperCase();

        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({
                ok: false,
                message: 'Rol inválido'
            });
        }

        const existeUsuario = await findByEmail(correo);

        if (existeUsuario) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ese correo'
            });
        }

        const hashedPassword = await hash(password, 10);

        const nuevoUsuario = await create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            correo,
            password: hashedPassword,
            telefono: telefono ? telefono.trim() : null,
            rol
        });

        res.status(201).json({
            ok: true,
            message: 'Usuario creado correctamente',
            data: nuevoUsuario
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { nombre, apellido, correo, password, telefono, rol } = req.body;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuarioExistente = await findById(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        const dataToUpdate = {};

        if (nombre !== undefined) dataToUpdate.nombre = nombre.trim();
        if (apellido !== undefined) dataToUpdate.apellido = apellido.trim();

        if (correo !== undefined) {
            const correoNormalizado = correo.trim().toLowerCase();
            const usuarioConCorreo = await findByEmail(correoNormalizado);

            if (usuarioConCorreo && usuarioConCorreo.id !== Number(id)) {
                return res.status(409).json({
                    ok: false,
                    message: 'Ese correo ya está en uso por otro usuario'
                });
            }

            dataToUpdate.correo = correoNormalizado;
        }

        if (telefono !== undefined) dataToUpdate.telefono = telefono ? telefono.trim() : null;

        if (rol !== undefined) {
            const rolNormalizado = rol.trim().toUpperCase();

            if (!ROLES_VALIDOS.includes(rolNormalizado)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Rol inválido'
                });
            }

            dataToUpdate.rol = rolNormalizado;
        }

        if (password !== undefined && password !== '') {
            dataToUpdate.password = await hash(password, 10);
        }

        const usuarioActualizado = await update(id, dataToUpdate);

        res.json({
            ok: true,
            message: 'Usuario actualizado correctamente',
            data: usuarioActualizado
        });
    } catch (error) {
        next(error);
    }
};

export const cambiarEstadoUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { estado } = req.body;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuarioExistente = await findById(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        estado = (estado || '').trim().toUpperCase();

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                ok: false,
                message: 'Estado inválido. Usa ACTIVO o INACTIVO'
            });
        }

        const usuarioActualizado = await updateStatus(id, estado);

        res.json({
            ok: true,
            message: 'Estado del usuario actualizado correctamente',
            data: usuarioActualizado
        });
    } catch (error) {
        next(error);
    }
};