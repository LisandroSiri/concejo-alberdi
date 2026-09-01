import { Router, Request, Response } from 'express';
import { getDashboard } from '../controllers/admin.controller';
import { verifyToken, soloAdmin } from '../middleware/auth';
import path from 'path';

const router = Router();

// API stats (JSON)
router.get('/stats', verifyToken, soloAdmin, getDashboard);



export default router;
