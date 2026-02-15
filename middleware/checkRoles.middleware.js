// Middleware que permite múltiples roles
const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }
        
        if (!allowedRoles.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
        }
        
        next();
    };
};

export default checkRoles;
