import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { normalizeText, titleCase } from '../utils/normalizeText';

export const listarTemas = async (_req: Request, res: Response): Promise<void> => {
  const temas = await prisma.tema.findMany({ orderBy: { nombre: 'asc' } });
  res.json(temas);
};

export const crearTema = async (req: Request, res: Response): Promise<void> => {
  const { nombre } = req.body;
  if (!nombre) { res.status(400).json({ error: 'nombre requerido' }); return; }

  const normalizado = normalizeText(nombre);

  // Buscar si ya existe uno con el mismo texto normalizado
  const todos = await prisma.tema.findMany();
  const duplicado = todos.find(t => normalizeText(t.nombre) === normalizado);
  if (duplicado) {
    res.status(409).json({ error: 'Ya existe un tema similar', existente: duplicado });
    return;
  }

  const tema = await prisma.tema.create({ data: { nombre: titleCase(nombre) } });
  res.status(201).json(tema);
};

export const actualizarTema = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { nombre } = req.body;
  if (!nombre) { res.status(400).json({ error: 'nombre requerido' }); return; }

  const normalizado = normalizeText(nombre);
  const todos = await prisma.tema.findMany({ where: { id: { not: id } } });
  const duplicado = todos.find(t => normalizeText(t.nombre) === normalizado);
  if (duplicado) {
    res.status(409).json({ error: 'Ya existe un tema similar', existente: duplicado });
    return;
  }

  const tema = await prisma.tema.update({ where: { id }, data: { nombre: titleCase(nombre) } });
  res.json(tema);
};

export const eliminarTema = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  await prisma.tema.delete({ where: { id } });
  res.status(204).send();
};
