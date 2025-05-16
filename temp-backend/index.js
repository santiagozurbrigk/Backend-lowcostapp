import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from './database/db.js';
import usuarioRoutes from './routes/usuario.routes.js';
import orderRoutes from './routes/order.routes.js';
import { EventEmitter } from 'events';
import logger from './utils/logger.js';
import precioRoutes from './routes/precioRoutes.js';
import pdfRoutes from './routes/pdf.routes.js';
import authMiddleware from './middleware/auth.middleware.js';

EventEmitter.defaultMaxListeners = 15;
dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());

// Rutas de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api', orderRoutes);
app.use('/api/precios', precioRoutes);
app.use('/api', pdfRoutes);

// Middleware para logging de requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        await pool.query('SELECT 1');
        logger.info('Base de datos conectada correctamente');

        const server = app.listen(PORT, () => {
            logger.info(`Servidor corriendo en el puerto ${PORT}`);
            
            // Imprimir las rutas disponibles de una manera más segura
            logger.info('Rutas registradas:');
            logger.info('- /api/usuarios/*');
            logger.info('- /api/pedidos/*');
            logger.info('- /api/pedidos/facturacion-diaria');
            logger.info('- /api/precios/*');
            logger.info('- /api/pdf/*');
        });
    } catch (error) {
        logger.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
