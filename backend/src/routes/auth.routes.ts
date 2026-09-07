import { Router } from 'express';
import { login, crearUsuario, listarUsuarios, toggleUsuario, resetPassword } from '../controllers/auth.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/usuarios', verifyToken, soloAdmin, crearUsuario);
router.get('/usuarios', verifyToken, listarUsuarios);
router.patch('/usuarios/:id/toggle', verifyToken, soloAdmin, toggleUsuario);
router.patch('/usuarios/:id/password', verifyToken, soloAdmin, resetPassword);

export default router;
