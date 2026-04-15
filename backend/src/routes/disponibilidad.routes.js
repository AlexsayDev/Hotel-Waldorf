import express from 'express';
import {
    buscarDisponibilidad,
    listarTiposHabitacion,
} from '../controllers/disponibilidad.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/buscar', buscarDisponibilidad);
router.get('/tipos', listarTiposHabitacion);

export default router;