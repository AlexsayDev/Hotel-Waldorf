// RUTAS DEL SISTEMA (eje: /api/usuarios)
import { Router } from 'express';
const router = Router();

import usuariosRoutes from './usuarios.routes.js';

router.get('/test', (req, res) => {
    res.json({
        ok: true,
        message: 'Ruta de prueba funcionando'
    });
});

router.use('/usuarios', usuariosRoutes);

export default router;