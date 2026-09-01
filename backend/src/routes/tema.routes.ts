import { Router } from 'express';
import { listarTemas, crearTema, actualizarTema, eliminarTema } from '../controllers/tema.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listarTemas);
router.post('/', verifyToken, crearTema);
router.put('/:id', verifyToken, actualizarTema);
router.delete('/:id', verifyToken, soloAdmin, eliminarTema);

export default router;
