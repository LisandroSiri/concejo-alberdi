import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña requeridos' });
    return;
  }
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.activo) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }
  const ok = await bcrypt.compare(password, usuario.passwordHash);
  if (!ok) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }
  const token = generateToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });
  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
};

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, password, nombre, rol } = req.body;
  if (!email || !password || !nombre) {
    res.status(400).json({ error: 'email, password y nombre son requeridos' });
    return;
  }
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    res.status(409).json({ error: 'El email ya está registrado' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const { idBloque } = req.body;
  const usuario = await prisma.usuario.create({
    data: { email, passwordHash, nombre, rol: rol ?? 'OPERADOR', idBloque: idBloque ? Number(idBloque) : null },
    select: { id: true, email: true, nombre: true, rol: true, activo: true, creadoEn: true, idBloque: true, bloque: true },
  });
  res.status(201).json(usuario);
};

export const listarUsuarios = async (_req: Request, res: Response): Promise<void> => {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, email: true, nombre: true, rol: true, activo: true, creadoEn: true, idBloque: true, bloque: true },
    orderBy: { creadoEn: 'desc' },
  });
  res.json(usuarios);
};

export const toggleUsuario = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
  const updated = await prisma.usuario.update({ where: { id }, data: { activo: !usuario.activo } });
  res.json({ activo: updated.activo });
};
