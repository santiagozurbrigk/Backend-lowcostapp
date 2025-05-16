import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, // Cambiado de DB_PASS a DB_PASSWORD
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

export const pool = sequelize;

// Verificar la conexión usando el método authenticate de Sequelize
sequelize.authenticate()
    .then(() => {
        console.log('Base de datos conectada correctamente');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });