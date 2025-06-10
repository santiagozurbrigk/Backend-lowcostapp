import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

async function up() {
    try {
        await sequelize.getQueryInterface().addColumn('usuarios', 'telefono', {
            type: DataTypes.STRING,
            allowNull: true // Permitimos null inicialmente para usuarios existentes
        });
        
        console.log('Campo telefono agregado correctamente a la tabla usuarios');
    } catch (error) {
        console.error('Error al agregar el campo telefono:', error);
        throw error;
    }
}

async function down() {
    try {
        await sequelize.getQueryInterface().removeColumn('usuarios', 'telefono');
        console.log('Campo telefono eliminado correctamente de la tabla usuarios');
    } catch (error) {
        console.error('Error al eliminar el campo telefono:', error);
        throw error;
    }
}

export { up, down };