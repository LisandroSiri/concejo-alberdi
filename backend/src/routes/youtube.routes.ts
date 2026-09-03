import { Router } from 'express';
import { getBroadcasts } from '../controllers/youtube.controller';

const router = Router();

// Endpoint público para obtener transmisiones con caché de 60 minutos
// Parámetros query: ?eventType=live o ?eventType=completed & maxResults=8
router.get('/broadcasts', getBroadcasts);

export default router;
