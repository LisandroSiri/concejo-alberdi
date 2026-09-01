import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const listarBloques = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.bloquePolitico.findMany({
      include: {
        usuarios: {
          where: { activo: true, rol: 'CONCEJAL' },
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const formatted = data.map((b) => ({
      ...b,
      concejales: b.usuarios,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error al listar bloques:', error);
    res.status(500).json({ error: error.message || 'Error al listar bloques' });
  }
};

export const crearBloque = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, sigla, colorHex } = req.body;
    if (!nombre || !sigla) {
      res.status(400).json({ error: 'nombre y sigla requeridos' });
      return;
    }
    const bloque = await prisma.bloquePolitico.create({ data: { nombre, sigla, colorHex } });
    res.status(201).json(bloque);
  } catch (error: any) {
    console.error('Error al crear bloque:', error);
    res.status(500).json({ error: error.message || 'Error al crear bloque' });
  }
};

export const actualizarBloque = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { nombre, sigla, colorHex, activo } = req.body;
    const bloque = await prisma.bloquePolitico.update({ where: { id }, data: { nombre, sigla, colorHex, activo } });
    res.json(bloque);
  } catch (error: any) {
    console.error('Error al actualizar bloque:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar bloque' });
  }
};

export const eliminarBloque = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.bloquePolitico.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar bloque:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar bloque' });
  }
};
