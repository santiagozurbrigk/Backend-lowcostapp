import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export async function up() {
    try {
        await sequelize.getQueryInterface().addColumn('usuarios', 'telefono', {
            type: DataTypes.STRING,
            allowNull: true
        });
        
        console.log('Campo telefono agregado correctamente a la tabla usuarios');
    } catch (error) {
        console.error('Error al agregar el campo telefono:', error);
        throw error;
    }
}

export async function down() {
    try {
        await sequelize.getQueryInterface().removeColumn('usuarios', 'telefono');
        console.log('Campo telefono eliminado correctamente de la tabla usuarios');
    } catch (error) {
        console.error('Error al eliminar el campo telefono:', error);
        throw error;
    }
} 