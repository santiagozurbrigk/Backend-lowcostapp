import express from 'express';
import { login, registro, renovarToken } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { perfil, actualizarPerfil } from '../controllers/usuario.controller.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', registro);

// Rutas protegidas
router.post('/renovar-token', authMiddleware, renovarToken);
router.get('/perfil', authMiddleware, perfil);
router.put('/perfil', authMiddleware, actualizarPerfil);

export default router;
