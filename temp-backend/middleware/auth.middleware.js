import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

const authMiddleware = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const usuario = await Usuario.findByPk(decoded.id, {
                attributes: ['id', 'nombre', 'email', 'rol']
            });

            if (!usuario) {
                return res.status(401).json({ 
                    mensaje: 'Sesión no válida - Por favor inicie sesión nuevamente',
                    error: 'USER_NOT_FOUND'
                });
            }

            req.usuario = usuario;
            return next();
        } catch (error) {
            console.error('Error de autenticación:', error);
            return res.status(401).json({ 
                mensaje: 'Sesión expirada - Por favor inicie sesión nuevamente',
                error: 'INVALID_TOKEN'
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            mensaje: 'No autorizado - Por favor inicie sesión',
            error: 'NO_TOKEN'
        });
    }
};

export default authMiddleware;