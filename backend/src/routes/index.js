// RUTAS DEL SISTEMA (eje: /api/usuarios)
import express from 'express';
import usuariosRoutes from './usuarios.routes.js';
import authRoutes from './auth.routes.js'
import habitacionesRoutes from './habitaciones.routes.js'
import disponibilidadRoutes from './disponibilidad.routes.js'
import reservasRoutes from './reservas.routes.js'

//import { Router } from 'express';
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({
        ok: true,
        message: 'Ruta de prueba funcionando'
    });
});

router.use('/auth', authRoutes)
router.use('/usuarios', usuariosRoutes);
router.use('/habitaciones', habitacionesRoutes);
router.use('/disponibilidad', disponibilidadRoutes);
router.use('/reservas', reservasRoutes)

export default router;