import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { findByEmail, findById } from '../models/usuarios.model.js';

const buildUserResponse = (user) => ({
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    telefono: user.telefono,
    rol: user.rol,
    estado: user.estado,
});

export const login = async (req, res, next) => {
    try {
        let { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Correo y contraseña son obligatorios',
            });
        }

        correo = correo.trim().toLowerCase();

        const usuario = await findByEmail(correo);

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas',
            });
        }

        if (usuario.estado !== 'ACTIVO') {
            return res.status(403).json({
                ok: false,
                message: 'Usuario inactivo',
            });
        }

        if (usuario.rol !== 'ADMIN') {
            return res.status(403).json({
                ok: false,
                message: 'Por el momento solo el administrador puede ingresar',
            });
        }

        const passwordValida = await compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas',
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            ok: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: buildUserResponse(usuario),
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        const usuario = await findById(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado',
            });
        }

        return res.json({
            ok: true,
            user: buildUserResponse(usuario),
        });
    } catch (error) {
        next(error);
    }
};