import { sequelize } from '../database/db.js';
import { Precio } from '../models/Precio.js';
import dotenv from 'dotenv';

dotenv.config();

async function inicializarPrecios() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        const preciosIniciales = [
            { tipo: 'simple_faz', precio: 50 },
            { tipo: 'doble_faz', precio: 80 },
            { tipo: 'doble_faz_2pag', precio: 100 },
            { tipo: 'anillado', precio: 2500 }
        ];

        console.log('Inicializando precios...');

        for (const precioData of preciosIniciales) {
            const precioExistente = await Precio.findOne({ where: { tipo: precioData.tipo } });
            
            if (precioExistente) {
                await Precio.update(
                    { precio: precioData.precio },
                    { where: { tipo: precioData.tipo } }
                );
                console.log(`✓ Precio ${precioData.tipo} actualizado: $${precioData.precio}`);
            } else {
                await Precio.create(precioData);
                console.log(`✓ Precio ${precioData.tipo} creado: $${precioData.precio}`);
            }
        }

        console.log('\n✅ Precios inicializados correctamente.');
        
        // Mostrar todos los precios
        const todosLosPrecios = await Precio.findAll();
        console.log('\nPrecios actuales:');
        todosLosPrecios.forEach(p => {
            console.log(`  - ${p.tipo}: $${p.precio}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error al inicializar precios:', error);
        process.exit(1);
    }
}

inicializarPrecios();
