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
import authRoutes from './routes/auth.routes.js';
import authMiddleware from './middleware/auth.middleware.js';

EventEmitter.defaultMaxListeners = 15;
dotenv.config();

const app = express();

// Configuración de CORS actualizada para incluir el FRONTEND_URL
app.use(cors({
    origin: [
        'https://paleturquoise-elephant-431228.hostingersite.com',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://lowcostimpresiones.com',
        'https://lowcostimpresiones.com',
        'https://frontend-pdfs.vercel.app', // Frontend en Vercel (antiguo)
        'https://lowcostimpresiones.vercel.app' // Frontend en Vercel (nuevo)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());

// Ruta de health check para Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Rutas de API
app.use('/api/auth', authRoutes);
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
        // Iniciar el servidor primero para que Render detecte que está escuchando
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            logger.info(`Servidor corriendo en el puerto ${PORT}`);
            
            // Imprimir las rutas disponibles
            console.log('Rutas registradas:');
            logger.info('Rutas registradas:');
            console.log('- /health');
            console.log('- /api/auth/login');
            console.log('- /api/auth/registro');
            logger.info('- /health');
            logger.info('- /api/auth/login');
            logger.info('- /api/auth/registro');
            logger.info('- /api/usuarios/*');
            logger.info('- /api/pedidos/*');
            logger.info('- /api/pedidos/facturacion-diaria');
            logger.info('- /api/precios/*');
            logger.info('- /api/pdf/*');
        });

        // Verificar conexión a la base de datos después de iniciar el servidor
        try {
            await sequelize.authenticate();
            console.log('Base de datos conectada correctamente');
            logger.info('Base de datos conectada correctamente');
        } catch (dbError) {
            console.error('Error al conectar con la base de datos:', dbError);
            logger.error('Error al conectar con la base de datos:', dbError);
            // No salir del proceso, el servidor puede seguir funcionando
        }

        // Inicializar WhatsApp
        console.log('Servicio de WhatsApp inicializado correctamente');
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        logger.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
