import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'concejo_secret_2024';

export interface AuthRequest extends Request {
  usuario?: { id: number; email: string; rol: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; rol: string };
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const soloAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.usuario?.rol !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado: se requiere rol ADMIN' });
    return;
  }
  next();
};

export const generateToken = (payload: { id: number; email: string; rol: string }) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
