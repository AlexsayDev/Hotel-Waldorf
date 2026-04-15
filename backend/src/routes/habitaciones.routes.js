import express from 'express';
import {
    obtenerHabitaciones,
    obtenerHabitacionPorId,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
} from '../controllers/habitaciones.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/', obtenerHabitaciones);
router.get('/:id', obtenerHabitacionPorId);
router.post('/', crearHabitacion);
router.put('/:id', actualizarHabitacion);
router.delete('/:id', eliminarHabitacion);

export default router;