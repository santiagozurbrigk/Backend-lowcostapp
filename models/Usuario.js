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
    telefono: {
        type: DataTypes.STRING,
        allowNull: true, // Permitimos null temporalmente para usuarios existentes
        validate: {
            isValidPhone(value) {
                // Solo validar si hay un valor
                if (value) {
                    const telefonoRegex = /^(\+?54)?(0|15)?[0-9]{8,10}$/;
                    if (!telefonoRegex.test(value)) {
                        throw new Error('El formato del teléfono no es válido. Debe ser un número argentino.');
                    }
                }
            }
        }
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