import { sequelize } from '../database/db.js';
import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createEmpleado() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Datos del empleado
        const nombre = 'Empleado';
        const email = 'empleadolocal@gmail.com';
        const password = 'localimpresioneslowcost';
        const telefono = '1123456789'; // Teléfono de ejemplo

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email } });
        
        if (existeUsuario) {
            console.log('El usuario empleado ya existe.');
            console.log('Email:', existeUsuario.email);
            console.log('Rol:', existeUsuario.rol);
            process.exit(0);
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario empleado
        const empleado = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            telefono,
            rol: 'empleado',
            confirmado: true
        });

        console.log('Usuario empleado creado exitosamente:');
        console.log('ID:', empleado.id);
        console.log('Nombre:', empleado.nombre);
        console.log('Email:', empleado.email);
        console.log('Rol:', empleado.rol);
        console.log('\nCredenciales de acceso:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión.');

        process.exit(0);
    } catch (error) {
        console.error('Error al crear el usuario empleado:', error);
        process.exit(1);
    }
}

createEmpleado();
