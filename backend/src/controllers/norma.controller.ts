import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/auth';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// ─── LISTAR con filtros ────────────────────────────────────────────────────────
export const listarNormas = async (req: Request, res: Response): Promise<void> => {
  const { tipo, anio, año, origen, temaId, autorId, vigente, page = '1', limit = '20' } = req.query;

  const where: Record<string, unknown> = {};
  if (tipo) where.tipo = tipo;
  if (origen) where.origen = origen;
  const anioFiltro = anio ?? año;
  if (anioFiltro) where.anio = Number(anioFiltro);
  if (vigente !== undefined) where.vigente = vigente === 'true';
  if (temaId) where.temas = { some: { idTema: Number(temaId) } };
  if (autorId) where.autores = { some: { idUsuario: Number(autorId) } };

  const skip = (Number(page) - 1) * Number(limit);
  const [total, normas] = await Promise.all([
    prisma.norma.count({ where }),
    prisma.norma.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: [{ anio: 'desc' }, { numero: 'desc' }],
      include: {
        autores: { include: { usuario: { select: { id: true, nombre: true, idBloque: true, bloque: true } } } },
        temas: { include: { tema: true } },
        estados: { include: { periodo: true, area: true }, orderBy: { periodo: { anio: 'desc' } } },
      },
    }),
  ]);

  res.json({ total, page: Number(page), limit: Number(limit), data: normas });
};

// ─── OBTENER una norma ────────────────────────────────────────────────────────
export const obtenerNorma = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const norma = await prisma.norma.findUnique({
    where: { id },
    include: {
      autores: { include: { usuario: { select: { id: true, nombre: true, idBloque: true, bloque: true } } } },
      temas: { include: { tema: true } },
      estados: {
        include: { periodo: true, area: true },
        orderBy: [{ periodo: { anio: 'desc' } }, { periodo: { numeroPeriodo: 'desc' } }],
      },
    },
  });
  if (!norma) { res.status(404).json({ error: 'Norma no encontrada' }); return; }
  res.json(norma);
};

// ─── CREAR norma (sin PDF) ────────────────────────────────────────────────────
export const crearNorma = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { numero, anio, año, tipo, origen, titulo, fechaSancion, vigente, autorIds, temaIds } = req.body;
    const valorAnio = Number(anio ?? año);
    const codigoNorma = `${tipo}-${numero}-${valorAnio}`;

    // Si se envían autorIds en el body, se usan esos.
    // Si no se envían, se asocia automáticamente el usuario autenticado que creó la norma.
    let idsAutores: number[] = [];
    if (Array.isArray(autorIds) && autorIds.length > 0) {
      idsAutores = autorIds.map(Number);
    } else if (req.usuario?.id) {
      idsAutores = [req.usuario.id];
    }

    const norma = await prisma.norma.create({
      data: {
        numero: Number(numero),
        anio: valorAnio,
        codigoNorma,
        tipo,
        origen,
        titulo,
        fechaSancion: new Date(fechaSancion),
        vigente: vigente !== false,
        autores: idsAutores.length
          ? { create: idsAutores.map((idUsuario: number) => ({ idUsuario })) }
          : undefined,
        temas: temaIds?.length
          ? { create: temaIds.map((id: number) => ({ idTema: Number(id) })) }
          : undefined,
      },
      include: {
        autores: { include: { usuario: { select: { id: true, nombre: true, email: true, rol: true } } } },
        temas: { include: { tema: true } },
      },
    });
    res.status(201).json(norma);
  } catch (error: any) {
    console.error('Error al crear norma:', error);
    res.status(500).json({ error: error.message || 'Error al crear norma' });
  }
};

// ─── ACTUALIZAR norma ─────────────────────────────────────────────────────────
export const actualizarNorma = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { titulo, vigente, autorIds, temaIds } = req.body;

  await prisma.$transaction(async (tx) => {
    await tx.norma.update({ where: { id }, data: { titulo, vigente } });
    if (autorIds) {
      await tx.normaAutor.deleteMany({ where: { idNorma: id } });
      await tx.normaAutor.createMany({ data: autorIds.map((aid: number) => ({ idNorma: id, idUsuario: Number(aid) })) });
    }
    if (temaIds) {
      await tx.normaTema.deleteMany({ where: { idNorma: id } });
      await tx.normaTema.createMany({ data: temaIds.map((tid: number) => ({ idNorma: id, idTema: Number(tid) })) });
    }
  });

  const norma = await prisma.norma.findUnique({ where: { id }, include: { autores: true, temas: true } });
  res.json(norma);
};

// ─── UPLOAD PDF ───────────────────────────────────────────────────────────────
export const subirPdf = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!req.file) { res.status(400).json({ error: 'No se recibió ningún archivo PDF' }); return; }

  const normaActual = await prisma.norma.findUnique({ where: { id } });
  if (!normaActual) { res.status(404).json({ error: 'Norma no encontrada' }); return; }

  // Eliminar PDF anterior si existe
  if (normaActual.rutaPdf) {
    const anterior = path.join(UPLOADS_DIR, path.basename(normaActual.rutaPdf));
    if (fs.existsSync(anterior)) fs.unlinkSync(anterior);
  }

  const buffer = fs.readFileSync(req.file.path);
  const hashPdf = crypto.createHash('sha256').update(buffer).digest('hex');

  const norma = await prisma.norma.update({
    where: { id },
    data: { rutaPdf: `/uploads/${req.file.filename}`, hashPdf },
  });
  res.json({ rutaPdf: norma.rutaPdf, hashPdf: norma.hashPdf });
};

// ─── ELIMINAR norma ───────────────────────────────────────────────────────────
export const eliminarNorma = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const norma = await prisma.norma.findUnique({ where: { id } });
  if (!norma) { res.status(404).json({ error: 'Norma no encontrada' }); return; }
  if (norma.rutaPdf) {
    const file = path.join(UPLOADS_DIR, path.basename(norma.rutaPdf));
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  await prisma.norma.delete({ where: { id } });
  res.status(204).send();
};
