import { Router } from 'express';
import { listarBloques, crearBloque, actualizarBloque, eliminarBloque } from '../controllers/bloque.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listarBloques);
router.post('/', verifyToken, crearBloque);
router.put('/:id', verifyToken, actualizarBloque);
router.delete('/:id', verifyToken, soloAdmin, eliminarBloque);

export default router;
