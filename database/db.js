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
        port: process.env.DB_PORT,
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 20000
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 60000
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

// Función para manejar la reconexión
const handleConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada correctamente');
        console.log('Configuración de conexión:', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            port: process.env.DB_PORT
        });
    } catch (err) {
        console.error('Error detallado al conectar con la base de datos:');
        console.error('Mensaje:', err.message);
        console.error('Código:', err.code);
        console.error('Estado:', err.state);
        console.error('Stack completo:', err.stack);
        console.error('Configuración de conexión:', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            port: process.env.DB_PORT
        });
        
        // Intentar reconectar después de 5 segundos
        setTimeout(handleConnection, 5000);
    }
};

// Iniciar la conexión
handleConnection();