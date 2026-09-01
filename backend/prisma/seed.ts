import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Usuario ADMIN ─────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('1234', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'lisandro@concejo.gob.ar' },
    update: { passwordHash, nombre: 'Lisandro', rol: 'ADMIN' },
    create: { email: 'lisandro@concejo.gob.ar', passwordHash, nombre: 'Lisandro', rol: 'ADMIN' },
  });
  console.log(`✔ Usuario ADMIN creado: ${admin.email}`);

  
  const passwordHash2 = await bcrypt.hash('1234', 10);
  const admin2 = await prisma.usuario.upsert({
    where: { email: 'agustin@concejo.gob.ar' },
    update: { passwordHash: passwordHash2, nombre: 'Agustin', rol: 'ADMIN' },
    create: { email: 'agustin@concejo.gob.ar', passwordHash: passwordHash2, nombre: 'Agustin', rol: 'ADMIN' },
  });
  console.log(`✔ Usuario ADMIN creado: ${admin.email}`);
  // ── Bloque político ───────────────────────────────────────────────────────
  const bloque = await prisma.bloquePolitico.upsert({
    where: { sigla: 'UCR' },
    update: {},
    create: { nombre: 'Unión Cívica Radical', sigla: 'UCR', colorHex: '#0066FF' },
  });
  console.log(`✔ Bloque creado: ${bloque.sigla}`);

  // ── Concejal (ahora es un Usuario con rol CONCEJAL) ───────────────────────
  const passwordConcejal = await bcrypt.hash('1234', 10);
  const concejal = await prisma.usuario.upsert({
    where: { email: 'juan.perez@concejo.gob.ar' },
    update: {},
    create: {
      email: 'juan.perez@concejo.gob.ar',
      passwordHash: passwordConcejal,
      nombre: 'Juan Pérez',
      rol: 'CONCEJAL',
      idBloque: bloque.id,
    },
  });
  console.log(`✔ Concejal creado: ${concejal.nombre}`);

  // ── Área del Ejecutivo ────────────────────────────────────────────────────
  const area = await prisma.areaEjecutivo.upsert({
    where: { nombre: 'Hacienda' },
    update: {},
    create: { nombre: 'Hacienda' },
  });
  console.log(`✔ Área creada: ${area.nombre}`);

  // ── Períodos 2026 ─────────────────────────────────────────────────────────
  const periodo1 = await prisma.periodo.upsert({
    where: { anio_numeroPeriodo: { anio: 2026, numeroPeriodo: 1 } },
    update: {},
    create: { anio: 2026, numeroPeriodo: 1, fechaInicio: new Date('2026-01-01'), fechaFin: new Date('2026-06-30') },
  });
  await prisma.periodo.upsert({
    where: { anio_numeroPeriodo: { anio: 2026, numeroPeriodo: 2 } },
    update: {},
    create: { anio: 2026, numeroPeriodo: 2, fechaInicio: new Date('2026-07-01'), fechaFin: new Date('2026-12-31') },
  });
  console.log(`✔ Períodos 2026 creados`);

  // ── Tema ──────────────────────────────────────────────────────────────────
  const tema = await prisma.tema.upsert({
    where: { nombre: 'Urbanismo' },
    update: {},
    create: { nombre: 'Urbanismo' },
  });
  console.log(`✔ Tema creado: ${tema.nombre}`);

  // ── Norma de prueba ───────────────────────────────────────────────────────
  const norma = await prisma.norma.create({
    data: {
      numero: 2325,
      anio: 2026,
      codigoNorma: 'ORDENANZA-2325-2026',
      tipo: 'ORDENANZA',
      origen: 'CONCEJO',
      titulo: 'Norma de prueba',
      fechaSancion: new Date('2026-03-15'),
      autores: { create: [{ idUsuario: concejal.id }] },
      temas: { create: [{ idTema: tema.id }] },
    },
  });
  console.log(`✔ Norma creada: ${norma.codigoNorma}`);

  // ── Historial de estados ──────────────────────────────────────────────────
  await prisma.registroEstado.create({
    data: {
      idNorma: norma.id,
      idPeriodo: periodo1.id,
      estado: 'PRESENTADA',
      observacion: 'Ingresada al período 2026-1',
      idArea: area.id,
    },
  });
  await prisma.registroEstado.create({
    data: {
      idNorma: norma.id,
      idPeriodo: periodo1.id,
      estado: 'VIGENTE',
      observacion: 'Aprobada en sesión ordinaria',
    },
  });
  console.log(`✔ Registros de estado creados`);

  console.log('\n✅ Datos de prueba creados correctamente');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
