import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  const [totalNormas, totalConcejales, totalTemas, totalBloques, normasPorTipo, ultimasNormas] = await Promise.all([
    prisma.norma.count(),
    prisma.usuario.count({ where: { rol: 'CONCEJAL', activo: true } }),
    prisma.tema.count(),
    prisma.bloquePolitico.count({ where: { activo: true } }),
    prisma.norma.groupBy({ by: ['tipo'], _count: { id: true } }),
    prisma.norma.findMany({
      take: 5,
      orderBy: { fechaSancion: 'desc' },
      select: { id: true, codigoNorma: true, titulo: true, tipo: true, fechaSancion: true },
    }),
  ]);
  res.json({ totalNormas, totalConcejales, totalTemas, totalBloques, normasPorTipo, ultimasNormas });
};
