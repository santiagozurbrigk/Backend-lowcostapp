import express from 'express';
import { login, registro } from '../controllers/authController.js';
import checkAuth from '../middleware/checkAuth.js';
import { perfil, actualizarPerfil } from '../controllers/usuarioController.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', registro);

// Rutas protegidas
router.get('/perfil', checkAuth, perfil);
router.put('/perfil', checkAuth, actualizarPerfil);

export default router;
