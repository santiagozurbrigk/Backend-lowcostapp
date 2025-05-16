import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Precio = sequelize.define('precios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'precios',
    timestamps: false  // Deshabilitamos los timestamps para evitar el conflicto
});

export default Precio;