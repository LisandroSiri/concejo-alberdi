import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.routes';
import normaRoutes from './routes/norma.routes';
import temaRoutes from './routes/tema.routes';
import bloqueRoutes from './routes/bloque.routes';
import periodoRoutes from './routes/periodo.routes';
import registroEstadoRoutes from './routes/registro-estado.routes';
import adminRoutes from './routes/admin.routes';
import youtubeRoutes from './routes/youtube.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Servir PDFs subidos y panel admin
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/normas', normaRoutes);
app.use('/api/temas', temaRoutes);
app.use('/api/bloques', bloqueRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/registros-estado', registroEstadoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/youtube', youtubeRoutes);




app.get('/', (_req, res) => {
  res.json({ message: 'API Concejo Alberdi v1.0', docs: '/admin' });
});

export default app;