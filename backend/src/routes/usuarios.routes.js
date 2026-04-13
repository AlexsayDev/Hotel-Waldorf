// DEFINIR ENDPOINTS DE USUARIOS
/**
 * GET /api/usuarios
 * GET /api/usuarios/:id
 * POST /api/usuarios
 * PUT /api/usuarios/:id
 * PATCH /api/usuarios/:id/estado
 */

import { Router } from 'express';
const router = Router();

import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, cambiarEstadoUsuario } from '../controllers/usuarios.controller.js';

router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.patch('/:id/estado', cambiarEstadoUsuario);

export default router;