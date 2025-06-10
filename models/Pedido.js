import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Usuario } from './Usuario.js';

export const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_impresion: {
        type: DataTypes.ENUM('simple_faz', 'doble_faz', 'doble_faz_2pag'),
        allowNull: false
    },
    acabado: {
        type: DataTypes.ENUM('anillado', 'abrochado', 'sin_acabado'),
        allowNull: false
    },
    copias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    num_paginas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'listo_para_retirar', 'retirado'),
        defaultValue: 'pendiente'
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    configuraciones_adicionales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'pedidos',
    timestamps: true
});

// Definir la relación
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });