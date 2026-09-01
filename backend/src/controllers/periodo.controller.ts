import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// ─── LISTAR períodos ──────────────────────────────────────────────────────────
export const listarPeriodos = async (_req: Request, res: Response): Promise<void> => {
  const periodos = await prisma.periodo.findMany({
    orderBy: [{ anio: 'desc' }, { numeroPeriodo: 'desc' }],
  });
  res.json(periodos);
};

// ─── CREAR período ────────────────────────────────────────────────────────────
export const crearPeriodo = async (req: Request, res: Response): Promise<void> => {
  const { anio, numeroPeriodo, fechaInicio, fechaFin } = req.body;

  if (!anio || !numeroPeriodo || !fechaInicio || !fechaFin) {
    res.status(400).json({ error: 'anio, numeroPeriodo, fechaInicio y fechaFin son requeridos' });
    return;
  }

  const periodo = await prisma.periodo.create({
    data: {
      anio: Number(anio),
      numeroPeriodo: Number(numeroPeriodo),
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    },
  });
  res.status(201).json(periodo);
};

// ─── GENERAR los 2 períodos de un año automáticamente ────────────────────────
export const generarPeriodosAnio = async (req: Request, res: Response): Promise<void> => {
  const anio = Number(req.params.anio);
  if (isNaN(anio) || anio < 2000 || anio > 2100) {
    res.status(400).json({ error: 'Año inválido' });
    return;
  }

  const definiciones = [
    { numeroPeriodo: 1, fechaInicio: new Date(`${anio}-01-01`), fechaFin: new Date(`${anio}-06-30`) },
    { numeroPeriodo: 2, fechaInicio: new Date(`${anio}-07-01`), fechaFin: new Date(`${anio}-12-31`) },
  ];

  const resultados = await Promise.all(
    definiciones.map((d) =>
      prisma.periodo.upsert({
        where: { anio_numeroPeriodo: { anio, numeroPeriodo: d.numeroPeriodo } },
        update: {},
        create: { anio, ...d },
      })
    )
  );

  res.status(201).json(resultados);
};
