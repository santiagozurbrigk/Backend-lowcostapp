const checkAdmin = async (req, res, next) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({
                mensaje: 'No tienes permisos para realizar esta acción'
            });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al verificar permisos' });
    }
};

export default checkAdmin;