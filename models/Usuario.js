import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rol: {
        type: DataTypes.ENUM('cliente', 'admin'),
        defaultValue: 'cliente'
    }
}, {
    tableName: 'usuarios',
    timestamps: true
});