import { sequelize } from '../database/db.js';

export async function up() {
    try {
        // Modificar el ENUM para incluir 'empleado'
        await sequelize.query(`
            ALTER TABLE usuarios 
            MODIFY COLUMN rol ENUM('cliente', 'admin', 'empleado') DEFAULT 'cliente'
        `);
        
        console.log('Rol empleado agregado correctamente al ENUM');
    } catch (error) {
        console.error('Error al agregar el rol empleado:', error);
        throw error;
    }
}

export async function down() {
    try {
        // Revertir el ENUM a solo 'cliente' y 'admin'
        // Nota: Esto fallará si hay usuarios con rol 'empleado'
        await sequelize.query(`
            ALTER TABLE usuarios 
            MODIFY COLUMN rol ENUM('cliente', 'admin') DEFAULT 'cliente'
        `);
        
        console.log('Rol empleado eliminado correctamente del ENUM');
    } catch (error) {
        console.error('Error al eliminar el rol empleado:', error);
        throw error;
    }
}
