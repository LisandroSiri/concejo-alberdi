import { Router } from 'express';
import {
  listarRegistros, crearRegistro, actualizarRegistro, eliminarRegistro,
  estadoActual, listarAreas, crearArea,
} from '../controllers/registro-estado.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';

const router = Router();

// Estado actual de una norma (el registro más reciente)
router.get('/norma/:normaId/actual', estadoActual);

// Historial completo / registros con filtros
router.get('/', listarRegistros);
router.post('/', verifyToken, crearRegistro);
router.put('/:id', verifyToken, actualizarRegistro);
router.delete('/:id', verifyToken, soloAdmin, eliminarRegistro);

// Catálogo de áreas del ejecutivo
router.get('/areas', listarAreas);
router.post('/areas', verifyToken, soloAdmin, crearArea);

export default router;
