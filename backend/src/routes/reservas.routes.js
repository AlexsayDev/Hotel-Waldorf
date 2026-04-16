import express from 'express';
import {
    obtenerReservas,
    obtenerReservaPorId,
    buscarHabitacionesDisponiblesParaReserva,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
} from '../controllers/reservas.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/disponibles', buscarHabitacionesDisponiblesParaReserva);
router.get('/', obtenerReservas);
router.get('/:id', obtenerReservaPorId);
router.post('/', crearReserva);
router.put('/:id', actualizarReserva);
router.patch('/:id/cancelar', cancelarReserva);

export default router;