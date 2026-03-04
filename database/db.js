import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 20000
        },
        dialectOptions: {
            // Habilitar SSL para Freedb.tech y otros servicios que lo requieren
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false,
            connectTimeout: 60000,
            // Agregar opciones adicionales para mejorar la conexión
            multipleStatements: false,
            dateStrings: false,
            typeCast: true
        },
        retry: {
            match: [
                /Deadlock/i,
                /ETIMEDOUT/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/
            ],
            max: 5,
            backoffBase: 1000,
            backoffExponent: 1.5
        }
    }
);

export const pool = sequelize;

// Función para manejar la reconexión con límite de intentos
let intentosReconexion = 0;
const MAX_INTENTOS_RECONEXION = 10;
const INTERVALO_RECONEXION = 10000; // 10 segundos

const handleConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada correctamente');
        console.log('Configuración de conexión:', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            port: process.env.DB_PORT || 3306,
            ssl: process.env.DB_SSL === 'true'
        });
        intentosReconexion = 0; // Resetear contador en caso de éxito
    } catch (err) {
        intentosReconexion++;
        
        console.error(`❌ Error al conectar con la base de datos (Intento ${intentosReconexion}/${MAX_INTENTOS_RECONEXION}):`);
        console.error('Mensaje:', err.message);
        console.error('Código:', err.code);
        console.error('Estado:', err.state);
        
        // Solo mostrar stack completo en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack completo:', err.stack);
        }
        
        console.error('Configuración de conexión:', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            port: process.env.DB_PORT || 3306,
            ssl: process.env.DB_SSL === 'true'
        });
        
        
        // Intentar reconectar solo si no se ha excedido el límite de intentos
        if (intentosReconexion < MAX_INTENTOS_RECONEXION) {
            console.log(`Reintentando conexión en ${INTERVALO_RECONEXION / 1000} segundos...`);
            setTimeout(handleConnection, INTERVALO_RECONEXION);
        } else {
            console.error('⚠️ Se alcanzó el límite máximo de intentos de reconexión. Por favor, verifica la configuración de la base de datos.');
            // No intentar más reconexiones automáticas después del límite
        }
    }
};

// Iniciar la conexión
handleConnection();