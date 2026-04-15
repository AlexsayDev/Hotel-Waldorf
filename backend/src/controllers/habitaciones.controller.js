import {
    findAll,
    findById,
    findByNumero,
    create,
    update,
    remove,
} from '../models/habitaciones.model.js';

const ESTADOS_VALIDOS = ['ACTIVA', 'MANTENIMIENTO', 'INACTIVA'];

const esIdValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const esCapacidadValida = (capacidad) =>
    Number.isInteger(Number(capacidad)) && Number(capacidad) > 0;

const esPrecioValido = (precio) => !isNaN(Number(precio)) && Number(precio) >= 0;

export const obtenerHabitaciones = async (req, res, next) => {
    try {
        const habitaciones = await findAll();

        res.json({
            ok: true,
            data: habitaciones,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerHabitacionPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de habitación inválido',
            });
        }

        const habitacion = await findById(id);

        if (!habitacion) {
            return res.status(404).json({
                ok: false,
                message: 'Habitación no encontrada',
            });
        }

        res.json({
            ok: true,
            data: habitacion,
        });
    } catch (error) {
        next(error);
    }
};

export const crearHabitacion = async (req, res, next) => {
    try {
        let {
            numero,
            tipo,
            capacidad,
            precio_base,
            estado,
            descripcion,
            servicios,
            foto_url,
        } = req.body;

        if (!numero || !tipo || capacidad === undefined || precio_base === undefined) {
            return res.status(400).json({
                ok: false,
                message: 'Número, tipo, capacidad y precio base son obligatorios',
            });
        }

        numero = String(numero).trim();
        tipo = String(tipo).trim();
        estado = (estado || 'ACTIVA').trim().toUpperCase();

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                ok: false,
                message: 'Estado inválido',
            });
        }

        if (!esCapacidadValida(capacidad)) {
            return res.status(400).json({
                ok: false,
                message: 'La capacidad debe ser un número entero mayor a 0',
            });
        }

        if (!esPrecioValido(precio_base)) {
            return res.status(400).json({
                ok: false,
                message: 'El precio base debe ser un número válido',
            });
        }

        const existeNumero = await findByNumero(numero);

        if (existeNumero) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe una habitación con ese número',
            });
        }

        const nuevaHabitacion = await create({
            numero,
            tipo,
            capacidad: Number(capacidad),
            precio_base: Number(precio_base),
            estado,
            descripcion: descripcion ? descripcion.trim() : null,
            servicios: servicios ? servicios.trim() : null,
            foto_url: foto_url ? foto_url.trim() : null,
        });

        res.status(201).json({
            ok: true,
            message: 'Habitación creada correctamente',
            data: nuevaHabitacion,
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarHabitacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        let {
            numero,
            tipo,
            capacidad,
            precio_base,
            estado,
            descripcion,
            servicios,
            foto_url,
        } = req.body;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de habitación inválido',
            });
        }

        const habitacionExistente = await findById(id);

        if (!habitacionExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Habitación no encontrada',
            });
        }

        const dataToUpdate = {};

        if (numero !== undefined) {
            const numeroNormalizado = String(numero).trim();
            const habitacionConNumero = await findByNumero(numeroNormalizado);

            if (habitacionConNumero && habitacionConNumero.id !== Number(id)) {
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe una habitación con ese número',
                });
            }

            dataToUpdate.numero = numeroNormalizado;
        }

        if (tipo !== undefined) dataToUpdate.tipo = String(tipo).trim();

        if (capacidad !== undefined) {
            if (!esCapacidadValida(capacidad)) {
                return res.status(400).json({
                    ok: false,
                    message: 'La capacidad debe ser un número entero mayor a 0',
                });
            }

            dataToUpdate.capacidad = Number(capacidad);
        }

        if (precio_base !== undefined) {
            if (!esPrecioValido(precio_base)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El precio base debe ser un número válido',
                });
            }

            dataToUpdate.precio_base = Number(precio_base);
        }

        if (estado !== undefined) {
            const estadoNormalizado = String(estado).trim().toUpperCase();

            if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Estado inválido',
                });
            }

            dataToUpdate.estado = estadoNormalizado;
        }

        if (descripcion !== undefined) {
            dataToUpdate.descripcion = descripcion ? descripcion.trim() : null;
        }

        if (servicios !== undefined) {
            dataToUpdate.servicios = servicios ? servicios.trim() : null;
        }

        if (foto_url !== undefined) {
            dataToUpdate.foto_url = foto_url ? foto_url.trim() : null;
        }

        const habitacionActualizada = await update(id, dataToUpdate);

        res.json({
            ok: true,
            message: 'Habitación actualizada correctamente',
            data: habitacionActualizada,
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarHabitacion = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de habitación inválido',
            });
        }

        const habitacionExistente = await findById(id);

        if (!habitacionExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Habitación no encontrada',
            });
        }

        await remove(id);

        res.json({
            ok: true,
            message: 'Habitación eliminada correctamente',
        });
    } catch (error) {
        next(error);
    }
};