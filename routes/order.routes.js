import express from 'express';
import { 
    obtenerEstadisticas, 
    historialPedidos, 
    subirPedido, 
    obtenerTodosPedidos,
    actualizarEstadoPedido,
    obtenerFacturacionDiaria,
    obtenerPedido,
    eliminarPedido
} from '../controllers/order.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import checkRole from '../middleware/checkRole.middleware.js';
import upload from '../middleware/uploadMiddleware.js';
import rateLimit from 'express-rate-limit';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Pedido } from '../models/Pedido.js';

const router = express.Router();

// Configuración del rate limiting
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 horas
    max: 350 // límite de 350 pedidos por día (margen extra)
});

// Rutas protegidas
router.use(authMiddleware);

// Rutas generales
// Modificar la ruta de pedidos para aceptar múltiples archivos
router.post('/pedidos', limiter, upload.array('archivos', 5), subirPedido);
router.get('/pedidos/estadisticas', obtenerEstadisticas);
router.get('/pedidos/historial', historialPedidos);
router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `./uploads/${filename}`;
    const fs = require('fs');
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Archivo no encontrado: ${filePath}`);
            return res.status(404).json({ error: 'Archivo no encontrado', filePath });
        }
        res.download(filePath, (err) => {
            if (err) {
                console.error(`Error al descargar el archivo: ${err.message}`);
                return res.status(500).json({ error: 'Error al descargar el archivo', message: err.message, filePath });
            }
        });
    });
});

// Ruta para obtener la facturación diaria
router.get('/pedidos/facturacion-diaria', obtenerFacturacionDiaria);

// Ruta para administradores
router.get('/pedidos/todos', checkRole('admin'), obtenerTodosPedidos);
router.put('/pedidos/:id/estado', checkRole('admin'), actualizarEstadoPedido);
router.get('/pedidos/:id', checkRole('admin'), obtenerPedido);
router.delete('/pedidos/:id', checkRole('admin'), eliminarPedido);

export default router;
