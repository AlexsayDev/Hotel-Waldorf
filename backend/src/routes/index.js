// RUTAS DEL SISTEMA (eje: /api/usuarios)
import express from 'express';
import usuariosRoutes from './usuarios.routes.js';
import authRoutes from './auth.routes.js'

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

export default router;