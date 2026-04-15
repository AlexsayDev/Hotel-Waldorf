import {
    buscarHabitacionesDisponibles,
    obtenerTiposHabitacionDisponibles,
} from '../models/disponibilidad.model.js';

const esFechaValida = (fecha) => {
    return !Number.isNaN(Date.parse(fecha));
};

export const buscarDisponibilidad = async (req, res, next) => {
    try {
        let { fecha_entrada, fecha_salida, personas, tipo } = req.query;

        if (!fecha_entrada || !fecha_salida || !personas) {
            return res.status(400).json({
                ok: false,
                message: 'Fecha de entrada, fecha de salida y número de personas son obligatorios',
            });
        }

        if (!esFechaValida(fecha_entrada) || !esFechaValida(fecha_salida)) {
            return res.status(400).json({
                ok: false,
                message: 'Las fechas no son válidas',
            });
        }

        if (new Date(fecha_entrada) >= new Date(fecha_salida)) {
            return res.status(400).json({
                ok: false,
                message: 'La fecha de salida debe ser mayor que la fecha de entrada',
            });
        }

        personas = Number(personas);

        if (!Number.isInteger(personas) || personas <= 0) {
            return res.status(400).json({
                ok: false,
                message: 'El número de personas debe ser mayor a 0',
            });
        }

        const habitaciones = await buscarHabitacionesDisponibles({
            fechaEntrada: fecha_entrada,
            fechaSalida: fecha_salida,
            personas,
            tipo: tipo ? tipo.trim() : '',
        });

        res.json({
            ok: true,
            filtros: {
                fecha_entrada,
                fecha_salida,
                personas,
                tipo: tipo || null,
            },
            total: habitaciones.length,
            data: habitaciones,
        });
    } catch (error) {
        next(error);
    }
};

export const listarTiposHabitacion = async (req, res, next) => {
    try {
        const tipos = await obtenerTiposHabitacionDisponibles();

        res.json({
            ok: true,
            data: tipos,
        });
    } catch (error) {
        next(error);
    }
};