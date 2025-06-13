import { Pedido } from '../models/Pedido.js';
import { Usuario } from '../models/Usuario.js';
import { sequelize } from '../database/db.js';
import { QueryTypes, Op } from 'sequelize';  // Agregamos Op a las importaciones

// En la función subirPedido, elimina la parte de actualización de facturación diaria
const subirPedido = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: 'No se recibieron datos del pedido' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ mensaje: 'No se recibieron archivos' });
        }

        const configuraciones = req.body.configuraciones.map(config => 
            typeof config === 'string' ? JSON.parse(config) : config
        );

        // Crear un solo pedido con todos los archivos
        const pedido = await Pedido.create({
            usuario_id: req.usuario.id,
            archivo: req.files.map(file => file.filename).join(','),
            tipo_impresion: configuraciones[0].tipo_impresion,
            acabado: configuraciones[0].acabado,
            copias: configuraciones.reduce((total, config) => total + parseInt(config.copias), 0),
            num_paginas: configuraciones.reduce((total, config) => total + parseInt(config.num_paginas), 0),
            precio_total: parseFloat(req.body.precio_total),
            estado: 'pendiente',
            observaciones: req.body.observaciones || '',
            configuraciones_adicionales: JSON.stringify(configuraciones)
        });

        res.json({
            mensaje: 'Pedido creado correctamente',
            pedido: {
                id: pedido.id,
                archivo: pedido.archivo
            }
        });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ 
            mensaje: 'Error al crear el pedido',
            error: error.message 
        });
    }
};

const obtenerEstadisticas = async (req, res) => {
    try {
        const { id } = req.usuario;

        const estadisticas = await sequelize.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END), 0) as pendientes,
                COALESCE(SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END), 0) as en_proceso,
                COALESCE(SUM(CASE WHEN estado = 'listo_para_retirar' THEN 1 ELSE 0 END), 0) as listos_para_retirar,
                COALESCE(SUM(CASE WHEN estado = 'retirado' THEN 1 ELSE 0 END), 0) as retirados
            FROM pedidos 
            WHERE usuario_id = :usuarioId
        `, {
            replacements: { usuarioId: id },
            type: QueryTypes.SELECT
        });

        res.json(estadisticas[0]);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las estadísticas' });
    }
};

const historialPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { usuario_id: req.usuario.id },
            order: [['createdAt', 'DESC']]
        });

        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el historial de pedidos' });
    }
};

const obtenerTodosPedidos = async (req, res) => {
    try {
        console.log('Obteniendo todos los pedidos...');
        const pedidos = await Pedido.findAll({
            include: [{
                model: Usuario,
                attributes: ['id', 'nombre', 'email']
            }],
            attributes: {
                include: [
                    'id',
                    'archivo',
                    'tipo_impresion',
                    'acabado',
                    'copias',
                    'num_paginas',
                    'precio_total',
                    'estado',
                    'observaciones',
                    'configuraciones_adicionales',
                    'createdAt',
                    'updatedAt'
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        
        // Log para debugging
        console.log('Primer pedido (ejemplo):', {
            id: pedidos[0]?.id,
            observaciones: pedidos[0]?.observaciones
        });
        
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
    }
};

const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'en_proceso', 'listo_para_retirar', 'retirado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        const pedido = await Pedido.findOne({
            where: { id },
            include: [{
                model: Usuario,
                attributes: ['id', 'nombre', 'email', 'telefono']
            }]
        });
        
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        await pedido.update({ estado });

        // Enviar notificación por WhatsApp solo cuando el estado sea 'listo_para_retirar'
        if (estado === 'listo_para_retirar' && pedido.Usuario?.telefono) {
            try {
                const mensaje = `✨ ¡Tu pedido está listo para retirar! Podes pasar por el local de 9:00am hasta las 18:00hs de lunes a viernes, recorda traer el numero de pedido.\n\nNúmero de pedido: #${pedido.id}`;
                
            } catch (error) {
                console.error('Error al enviar mensaje de WhatsApp:', error);
            }
        }

        res.json({ 
            mensaje: 'Estado actualizado correctamente',
            notificacionEnviada: (estado === 'listo_para_retirar' && pedido.Usuario?.telefono) ? true : false
        });
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido' });
    }
};

const obtenerFacturacionDiaria = async (req, res) => {
    try {
        // Obtener el total de pedidos del día actual
        const [resultado] = await sequelize.query(`
            SELECT COALESCE(SUM(precio_total), 0.00) as total
            FROM pedidos
            WHERE DATE(createdAt) = CURDATE()
            AND estado != 'cancelado'
        `, {
            type: QueryTypes.SELECT
        });

        // Asegurar que el total sea un número con dos decimales
        const totalFacturacion = Number(parseFloat(resultado.total || 0).toFixed(2));

        // Actualizar o insertar en facturacion_diaria
        await sequelize.query(`
            INSERT INTO facturacion_diaria (fecha, monto)
            VALUES (CURDATE(), :total)
            ON DUPLICATE KEY UPDATE monto = :total
        `, {
            replacements: { total: totalFacturacion },
            type: QueryTypes.RAW
        });

        // Devolver el total actualizado
        res.json({
            facturacionDiaria: totalFacturacion
        });

        console.log('Facturación diaria actualizada:', totalFacturacion);

    } catch (error) {
        console.error('Error al obtener la facturación diaria:', error);
        res.status(500).json({ mensaje: 'Error al obtener la facturación diaria' });
    }
};

const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findOne({
            where: { id },
            include: [{
                model: Usuario,
                attributes: ['id', 'nombre', 'email']
            }],
            attributes: [
                'id',
                'archivo',
                'tipo_impresion',
                'acabado',
                'copias',
                'num_paginas',
                'precio_total',
                'estado',
                'observaciones',
                'configuraciones_adicionales',
                'createdAt',
                'updatedAt'
            ]
        });

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ mensaje: 'Error al obtener el pedido' });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        await pedido.destroy();

        res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el pedido' });
    }
};

export {
    subirPedido,
    obtenerEstadisticas,
    historialPedidos,
    obtenerTodosPedidos,
    actualizarEstadoPedido,
    obtenerFacturacionDiaria,
    obtenerPedido,
    eliminarPedido
};
