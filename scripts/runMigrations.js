import { up as addTelefonoMigration } from '../migrations/20240606_add_telefono_to_usuarios.js';

async function runMigrations() {
    try {
        console.log('Iniciando migraciones...');
        
        // Ejecutar migración para agregar campo telefono
        await addTelefonoMigration();
        
        console.log('Todas las migraciones se ejecutaron correctamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar las migraciones:', error);
        process.exit(1);
    }
}

runMigrations();