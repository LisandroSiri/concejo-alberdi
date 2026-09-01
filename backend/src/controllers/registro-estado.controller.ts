import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// ─── LISTAR historial con filtros ─────────────────────────────────────────────
// Por defecto devuelve todos los registros. Filtrar por normaId para ver el
// historial completo de una norma específica.
export const listarRegistros = async (req: Request, res: Response): Promise<void> => {
  const { normaId, periodoId, estado, areaId } = req.query;
  const where: Record<string, unknown> = {};
  if (normaId) where.idNorma = Number(normaId);
  if (periodoId) where.idPeriodo = Number(periodoId);
  if (estado) where.estado = estado;
  if (areaId) where.idArea = Number(areaId);

  const data = await prisma.registroEstado.findMany({
    where,
    include: {
      norma: { select: { codigoNorma: true, titulo: true, tipo: true } },
      periodo: true,
      area: true,
    },
    orderBy: { creadoEn: 'desc' },
  });
  res.json(data);
};

// ─── ESTADO ACTUAL de una norma ───────────────────────────────────────────────
// Devuelve únicamente el último registro (el estado vigente hoy).
export const estadoActual = async (req: Request, res: Response): Promise<void> => {
  const idNorma = Number(req.params.normaId);
  const registro = await prisma.registroEstado.findFirst({
    where: { idNorma },
    include: { periodo: true, area: true },
    orderBy: { creadoEn: 'desc' },
  });
  if (!registro) { res.status(404).json({ error: 'La norma no tiene registros de estado' }); return; }
  res.json(registro);
};

// ─── REGISTRAR un cambio de estado ───────────────────────────────────────────
// Siempre crea un registro nuevo — nunca pisa el anterior.
// Así se construye el historial completo de la norma.
export const crearRegistro = async (req: Request, res: Response): Promise<void> => {
  const { idNorma, idPeriodo, estado, observacion, idArea } = req.body;

  if (!idNorma || !idPeriodo || !estado) {
    res.status(400).json({ error: 'idNorma, idPeriodo y estado son requeridos' });
    return;
  }

  const registro = await prisma.registroEstado.create({
    data: {
      idNorma: Number(idNorma),
      idPeriodo: Number(idPeriodo),
      estado,
      observacion,
      idArea: idArea ? Number(idArea) : null,
    },
    include: { norma: true, periodo: true, area: true },
  });
  res.status(201).json(registro);
};

// ─── CORREGIR un registro ─────────────────────────────────────────────────────
// Solo para correcciones de errores de carga (observación, área).
// El estado no debería modificarse en retrospectiva; para eso se crea uno nuevo.
export const actualizarRegistro = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { observacion, idArea } = req.body;

  const registro = await prisma.registroEstado.update({
    where: { id },
    data: {
      ...(observacion !== undefined && { observacion }),
      ...(idArea !== undefined && { idArea: idArea ? Number(idArea) : null }),
    },
    include: { norma: true, periodo: true, area: true },
  });
  res.json(registro);
};

// ─── ELIMINAR un registro ─────────────────────────────────────────────────────
export const eliminarRegistro = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  await prisma.registroEstado.delete({ where: { id } });
  res.status(204).send();
};

// ─── CATÁLOGO: Áreas del Ejecutivo ────────────────────────────────────────────
export const listarAreas = async (_req: Request, res: Response): Promise<void> => {
  res.json(await prisma.areaEjecutivo.findMany({ orderBy: { nombre: 'asc' } }));
};

export const crearArea = async (req: Request, res: Response): Promise<void> => {
  const { nombre } = req.body;
  if (!nombre) { res.status(400).json({ error: 'nombre requerido' }); return; }
  const area = await prisma.areaEjecutivo.create({ data: { nombre } });
  res.status(201).json(area);
};
