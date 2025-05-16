import express from 'express';
import { 
    registro, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword, 
    perfil,
    actualizarPerfil,
    obtenerUsuarios 
} from '../controllers/usuario.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import checkRole from '../middleware/checkRole.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/', registro);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// Rutas protegidas
router.use(authMiddleware);
router.get('/perfil', perfil);
router.put('/perfil', actualizarPerfil);

// Ruta de administrador
router.get('/todos', checkRole('admin'), obtenerUsuarios);

export default router;