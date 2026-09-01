import { Router } from 'express';
import { listarPeriodos, crearPeriodo, generarPeriodosAnio } from '../controllers/periodo.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listarPeriodos);
router.post('/', verifyToken, soloAdmin, crearPeriodo);
router.post('/generar/:anio', verifyToken, soloAdmin, generarPeriodosAnio);

export default router;
