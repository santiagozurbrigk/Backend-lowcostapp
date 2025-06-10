import { Router } from 'express';
import { contarPaginasPDF } from '../controllers/pdf.controller.js';
import multer from 'multer';

const router = Router();

// Configurar multer para manejar archivos en memoria
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // Límite de 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'));
        }
    }
});

router.post('/contar-paginas', upload.single('pdf'), contarPaginasPDF);

export default router;