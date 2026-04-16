import {
    findAll,
    findById,
    findHabitacionById,
    findConflictingReserva,
    findAvailableRoomsForReserva,
    create,
    update,
    cancel,
} from '../models/reservas.model.js';
import { generarCodigoReserva } from '../utils/generarCodigoReserva.js';

const esIdValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const esFechaValida = (fecha) => !Number.isNaN(Date.parse(fecha));

const calcularNoches = (fechaEntrada, fechaSalida) => {
    const entrada = new Date(`${fechaEntrada}T00:00:00`);
    const salida = new Date(`${fechaSalida}T00:00:00`);
    const diferenciaMs = salida - entrada;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
};

export const obtenerReservas = async (req, res, next) => {
    try {
        const reservas = await findAll();

        res.json({
            ok: true,
            data: reservas,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerReservaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de reserva inválido',
            });
        }

        const reserva = await findById(id);

        if (!reserva) {
            return res.status(404).json({
                ok: false,
                message: 'Reserva no encontrada',
            });
        }

        res.json({
            ok: true,
            data: reserva,
        });
    } catch (error) {
        next(error);
    }
};

export const buscarHabitacionesDisponiblesParaReserva = async (req, res, next) => {
    try {
        let {
            fecha_entrada,
            fecha_salida,
            personas,
            tipo,
            exclude_reserva_id,
        } = req.query;

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

        const habitaciones = await findAvailableRoomsForReserva({
            fechaEntrada: fecha_entrada,
            fechaSalida: fecha_salida,
            personas,
            tipo: tipo ? tipo.trim() : '',
            excludeReservaId: exclude_reserva_id ? Number(exclude_reserva_id) : null,
        });

        res.json({
            ok: true,
            data: habitaciones,
        });
    } catch (error) {
        next(error);
    }
};

export const crearReserva = async (req, res, next) => {
    try {
        let {
            habitacion_id,
            nombre_cliente,
            apellido_cliente,
            correo_cliente,
            telefono_cliente,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            observaciones,
        } = req.body;

        if (
            !habitacion_id ||
            !nombre_cliente ||
            !apellido_cliente ||
            !fecha_entrada ||
            !fecha_salida ||
            numero_personas === undefined
        ) {
            return res.status(400).json({
                ok: false,
                message: 'Habitación, cliente, fechas y número de personas son obligatorios',
            });
        }

        if (!esIdValido(habitacion_id)) {
            return res.status(400).json({
                ok: false,
                message: 'La habitación seleccionada no es válida',
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

        numero_personas = Number(numero_personas);

        if (!Number.isInteger(numero_personas) || numero_personas <= 0) {
            return res.status(400).json({
                ok: false,
                message: 'El número de personas debe ser mayor a 0',
            });
        }

        const habitacion = await findHabitacionById(habitacion_id);

        if (!habitacion) {
            return res.status(404).json({
                ok: false,
                message: 'Habitación no encontrada',
            });
        }

        if (habitacion.estado !== 'ACTIVA') {
            return res.status(400).json({
                ok: false,
                message: 'La habitación seleccionada no está activa',
            });
        }

        if (habitacion.capacidad < numero_personas) {
            return res.status(400).json({
                ok: false,
                message: 'La habitación no soporta esa cantidad de personas',
            });
        }

        const conflicto = await findConflictingReserva({
            habitacionId: Number(habitacion_id),
            fechaEntrada: fecha_entrada,
            fechaSalida: fecha_salida,
        });

        if (conflicto) {
            return res.status(409).json({
                ok: false,
                message: 'La habitación ya está reservada en esas fechas',
            });
        }

        const noches = calcularNoches(fecha_entrada, fecha_salida);
        const precio_noche = Number(habitacion.precio_base);
        const total_estancia = Number((precio_noche * noches).toFixed(2));
        const codigo_reserva = generarCodigoReserva();

        const nuevaReserva = await create({
            codigo_reserva,
            habitacion_id: Number(habitacion_id),
            nombre_cliente: nombre_cliente.trim(),
            apellido_cliente: apellido_cliente.trim(),
            correo_cliente: correo_cliente ? correo_cliente.trim().toLowerCase() : null,
            telefono_cliente: telefono_cliente ? telefono_cliente.trim() : null,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            precio_noche,
            total_estancia,
            observaciones: observaciones ? observaciones.trim() : null,
        });

        res.status(201).json({
            ok: true,
            message: 'Reserva creada correctamente',
            data: nuevaReserva,
        });

        if (!Number.isFinite(noches) || noches <= 0) {
            return res.status(400).json({
                ok: false,
                message: 'Las fechas de la reserva no son válidas',
            });
        }
    } catch (error) {
        next(error);
    }
};

export const actualizarReserva = async (req, res, next) => {
    try {
        const { id } = req.params;
        let {
            habitacion_id,
            nombre_cliente,
            apellido_cliente,
            correo_cliente,
            telefono_cliente,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            observaciones,
        } = req.body;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de reserva inválido',
            });
        }

        const reservaExistente = await findById(id);

        if (!reservaExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Reserva no encontrada',
            });
        }

        if (reservaExistente.estado === 'CANCELADA' || reservaExistente.estado === 'FINALIZADA') {
            return res.status(400).json({
                ok: false,
                message: 'No se puede modificar una reserva cancelada o finalizada',
            });
        }

        if (
            !habitacion_id ||
            !nombre_cliente ||
            !apellido_cliente ||
            !fecha_entrada ||
            !fecha_salida ||
            numero_personas === undefined
        ) {
            return res.status(400).json({
                ok: false,
                message: 'Habitación, cliente, fechas y número de personas son obligatorios',
            });
        }

        if (!esIdValido(habitacion_id)) {
            return res.status(400).json({
                ok: false,
                message: 'La habitación seleccionada no es válida',
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

        numero_personas = Number(numero_personas);

        if (!Number.isInteger(numero_personas) || numero_personas <= 0) {
            return res.status(400).json({
                ok: false,
                message: 'El número de personas debe ser mayor a 0',
            });
        }

        const habitacion = await findHabitacionById(habitacion_id);

        if (!habitacion) {
            return res.status(404).json({
                ok: false,
                message: 'Habitación no encontrada',
            });
        }

        if (habitacion.estado !== 'ACTIVA') {
            return res.status(400).json({
                ok: false,
                message: 'La habitación seleccionada no está activa',
            });
        }

        if (habitacion.capacidad < numero_personas) {
            return res.status(400).json({
                ok: false,
                message: 'La habitación no soporta esa cantidad de personas',
            });
        }

        const conflicto = await findConflictingReserva({
            habitacionId: Number(habitacion_id),
            fechaEntrada: fecha_entrada,
            fechaSalida: fecha_salida,
            excludeReservaId: Number(id),
        });

        if (conflicto) {
            return res.status(409).json({
                ok: false,
                message: 'La habitación ya está reservada en esas fechas',
            });
        }

        const noches = calcularNoches(fecha_entrada, fecha_salida);
        const precio_noche = Number(habitacion.precio_base);
        const total_estancia = Number((precio_noche * noches).toFixed(2));

        const reservaActualizada = await update(id, {
            habitacion_id: Number(habitacion_id),
            nombre_cliente: nombre_cliente.trim(),
            apellido_cliente: apellido_cliente.trim(),
            correo_cliente: correo_cliente ? correo_cliente.trim().toLowerCase() : null,
            telefono_cliente: telefono_cliente ? telefono_cliente.trim() : null,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            precio_noche,
            total_estancia,
            observaciones: observaciones ? observaciones.trim() : null,
        });

        res.json({
            ok: true,
            message: 'Reserva actualizada correctamente',
            data: reservaActualizada,
        });

        if (!Number.isFinite(noches) || noches <= 0) {
            return res.status(400).json({
                ok: false,
                message: 'Las fechas de la reserva no son válidas',
            });
        }
    } catch (error) {
        next(error);
    }
};

export const cancelarReserva = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({
                ok: false,
                message: 'ID de reserva inválido',
            });
        }

        const reservaExistente = await findById(id);

        if (!reservaExistente) {
            return res.status(404).json({
                ok: false,
                message: 'Reserva no encontrada',
            });
        }

        if (reservaExistente.estado === 'CANCELADA') {
            return res.status(400).json({
                ok: false,
                message: 'La reserva ya está cancelada',
            });
        }

        const reservaCancelada = await cancel(id);

        res.json({
            ok: true,
            message: 'Reserva cancelada correctamente',
            data: reservaCancelada,
        });
    } catch (error) {
        next(error);
    }
};