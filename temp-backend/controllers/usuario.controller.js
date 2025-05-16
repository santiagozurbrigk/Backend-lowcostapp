import { sequelize } from '../database/db.js';
import generarId from '../utils/generarId.js';
import generarJWT from '../utils/generarJWT.js';
import bcrypt from 'bcrypt';
import { DataTypes, Op } from 'sequelize';

// Definir el modelo de Usuario
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rol: {
        type: DataTypes.ENUM('cliente', 'admin'),
        defaultValue: 'cliente'
    }
}, {
    tableName: 'usuarios',
    timestamps: true
});

const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email } });
        
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Hashear el password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword
        });

        // Generar JWT
        const token = generarJWT(usuario.id);

        res.json({
            id: usuario.id,
            nombre,
            email,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Comprobar si el usuario existe
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'El usuario no existe' });
        }

        // Comprobar el password
        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(403).json({ mensaje: 'Password incorrecto' });
        }

        // Autenticar al usuario
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            token: generarJWT(usuario.id)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al autenticar el usuario' });
    }
};

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.usuario;
        const { nombre, email } = req.body;

        // Verificar si el email ya existe para otro usuario
        const usuarioExistente = await Usuario.findOne({
            where: {
                email,
                id: { [Op.ne]: id }
            }
        });

        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El email ya está en uso' });
        }

        // Actualizar el usuario
        await Usuario.update(
            { nombre, email },
            { where: { id } }
        );

        res.json({ mensaje: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
    }
};

const confirmar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener el perfil' });
    }
};

const olvidePassword = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener el perfil' });
    }
};

const comprobarToken = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener el perfil' });
    }
};

const nuevoPassword = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Hashear el nuevo password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await usuario.update({ password: hashedPassword });

        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al actualizar la contraseña' });
    }
};

const perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: ['id', 'nombre', 'email', 'rol'] // Solo devolver datos necesarios
        });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener el perfil' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol']
        });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
};

export {
    registro,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    actualizarPerfil,
    obtenerUsuarios
};