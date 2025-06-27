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
router.get('/uploads/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;
        const pedido = await Pedido.findByPk(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        // El campo 'archivo' puede tener varias URLs separadas por coma
        const archivos = pedido.archivo.split(',');
        if (archivos.length === 1) {
            // Si es un solo archivo, redirigir a la URL de S3
            return res.redirect(archivos[0]);
        } else {
            // Si son varios archivos, devolver el array de URLs
            return res.json({ archivos });
        }
    } catch (error) {
        console.error('Error al obtener archivo(s) de S3:', error);
        res.status(500).json({ error: 'Error al obtener archivo(s) de S3', message: error.message });
    }
});

// Ruta para obtener la facturación diaria
router.get('/pedidos/facturacion-diaria', obtenerFacturacionDiaria);

// Ruta para administradores
router.get('/pedidos/todos', checkRole('admin'), obtenerTodosPedidos);
router.put('/pedidos/:id/estado', checkRole('admin'), actualizarEstadoPedido);
router.get('/pedidos/:id', checkRole('admin'), obtenerPedido);
router.delete('/pedidos/:id', checkRole('admin'), eliminarPedido);

export default router;
