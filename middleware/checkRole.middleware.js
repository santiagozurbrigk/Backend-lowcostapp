const checkRole = (role) => {
    return (req, res, next) => {
        if (req.usuario.rol !== role) {
            return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
};

export default checkRole;