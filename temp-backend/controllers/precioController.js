import { Precio } from '../models/Precio.js';

const obtenerPrecios = async (req, res) => {
    try {
        const precios = await Precio.findAll();
        res.json(precios);
    } catch (error) {
        console.error('Error al obtener precios:', error);
        res.status(500).json({ mensaje: 'Error al obtener los precios' });
    }
};

const actualizarPrecios = async (req, res) => {
    try {
        const preciosArray = req.body;

        // Validar que todos los precios sean positivos
        const preciosInvalidos = preciosArray.some(p => p.precio < 0);
        if (preciosInvalidos) {
            return res.status(400).json({ 
                mensaje: 'Los precios deben ser valores positivos' 
            });
        }

        // Actualizar cada precio
        for (const { tipo, precio } of preciosArray) {
            const precioNumerico = tipo === 'limite_facturacion' ? 
                parseInt(precio) : // Usar parseInt para el límite de facturación
                parseFloat(precio); // Usar parseFloat para otros precios

            console.log(`Actualizando ${tipo} a: ${precioNumerico}`);

            // Primero verificamos si existe el registro
            let precioExistente = await Precio.findOne({ where: { tipo } });

            if (precioExistente) {
                // Si existe, actualizamos
                await Precio.update(
                    { precio: precioNumerico },
                    { where: { tipo } }
                );
            } else {
                // Si no existe, lo creamos
                precioExistente = await Precio.create({
                    tipo,
                    precio: precioNumerico
                });
            }

            // Verificar que se actualizó correctamente
            const precioActualizado = await Precio.findOne({ where: { tipo } });
            if (precioActualizado) {
                console.log(`${tipo} actualizado en DB: ${precioActualizado.precio}`);
            } else {
                throw new Error(`No se pudo actualizar el precio para: ${tipo}`);
            }
        }

        res.json({ mensaje: 'Precios actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar precios:', error);
        res.status(500).json({ mensaje: 'Error al actualizar los precios' });
    }
};

export {
    obtenerPrecios,
    actualizarPrecios
};