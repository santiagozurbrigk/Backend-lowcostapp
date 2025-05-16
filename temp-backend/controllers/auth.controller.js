import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verificar si el usuario existe
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

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
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const [existeUsuario] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (existeUsuario.length > 0) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        // Generar JWT
        const token = jwt.sign(
            { id: resultado.insertId },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: resultado.insertId,
            nombre,
            email,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
};

export {
    login,
    registro
};
