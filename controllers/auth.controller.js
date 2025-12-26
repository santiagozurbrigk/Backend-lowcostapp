import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/Usuario.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(403).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            rol: usuario.rol,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

const registro = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email } });
        
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            telefono: telefono || null
        });

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
};

const renovarToken = async (req, res) => {
    try {
        // El middleware de autenticación ya verificó el token y agregó el usuario a req
        const { id } = req.usuario;
        
        // Generar nuevo token
        const nuevoToken = jwt.sign(
            { id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token: nuevoToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al renovar el token' });
    }
};

export {
    login,
    registro,
    renovarToken
};
