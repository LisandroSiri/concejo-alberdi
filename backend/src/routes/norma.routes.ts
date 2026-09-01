import { Router } from 'express';
import {
  listarNormas, obtenerNorma, crearNorma,
  actualizarNorma, eliminarNorma, subirPdf,
} from '../controllers/norma.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';
import { uploadPdf } from '../middleware/upload';

const router = Router();

// Públicas (lectura)
router.get('/', listarNormas);
router.get('/:id', obtenerNorma);

// Protegidas
router.post('/', verifyToken, crearNorma);
router.put('/:id', verifyToken, actualizarNorma);
router.delete('/:id', verifyToken, soloAdmin, eliminarNorma);
router.post('/:id/pdf', verifyToken, uploadPdf.single('pdf'), subirPdf);

export default router;
