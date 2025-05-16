import express from 'express';
import { obtenerPrecios, actualizarPrecios } from '../controllers/precioController.js';
import authMiddleware from '../middleware/auth.middleware.js';
import checkRole from '../middleware/checkRole.middleware.js';

const router = express.Router();

// Ruta pública para obtener precios
router.get('/', obtenerPrecios);

// Ruta protegida para actualizar precios (solo admin)
router.put('/', authMiddleware, checkRole('admin'), actualizarPrecios);

export default router;