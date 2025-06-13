import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from './database/db.js';
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

// Configuración de CORS actualizada para incluir el FRONTEND_URL
app.use(cors({
    origin: [
        'https://paleturquoise-elephant-431228.hostingersite.com',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
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

const PORT = process.env.PORT || 10000; // Cambiamos el puerto por defecto a 10000

const startServer = async () => {
    try {
        // Verificar conexión a la base de datos usando sequelize
        await sequelize.authenticate();
        logger.info('Base de datos conectada correctamente');

        // Inicializar WhatsApp
        
        console.log('Servicio de WhatsApp inicializado correctamente');

        const server = app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Servidor corriendo en el puerto ${PORT}`);
            
            // Imprimir las rutas disponibles
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
