// ... existing code ...

export const obtenerTodosPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: Usuario,
                attributes: ['nombre', 'email']
            }],
            attributes: [
                'id',
                'estado',
                'precio_total',
                'createdAt',
                'fecha_modificacion',
                // Agregamos campos calculados usando Sequelize.literal
                [
                    Sequelize.fn(
                        'DATE_FORMAT',
                        Sequelize.col('createdAt'),
                        '%d/%m/%Y %H:%i'
                    ),
                    'fecha_creacion_formateada'
                ],
                [
                    Sequelize.fn(
                        'DATE_FORMAT',
                        Sequelize.col('fecha_modificacion'),
                        '%d/%m/%Y %H:%i'
                    ),
                    'fecha_modificacion_formateada'
                ]
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
    }
};

// ... existing code ...