# Diseño simplificado de la base de datos — Portal Legislativo

## Objetivo

Simplificar la base de datos del portal legislativo del Concejo Deliberante, evitando entidades y relaciones innecesarias.

El sistema debe permitir:

- Gestionar usuarios con diferentes roles.
- Asociar concejales a bloques políticos.
- Registrar normas y sus datos principales.
- Asociar normas con temas.
- Registrar los autores de las normas.
- Crear períodos automáticamente dos veces al año.
- Agrupar históricamente las normas por período.
- Registrar qué estado tenía cada norma durante cada período.
- Consultar la evolución histórica del estado de una norma.

---

# 1. Principio principal del diseño

La base de datos debe diferenciar claramente entre:

1. **La norma:** representa el documento/norma legislativa en sí.
2. **El período:** representa un intervalo temporal de seis meses.
3. **El estado histórico:** representa el estado que tenía una norma durante un período determinado.

La norma ya conoce su propia `fechaSancion`, por lo que **NO se debe almacenar nuevamente la fecha de sanción en `Periodo` ni en `RegistroEstado`**.

El período solo representa un intervalo de tiempo.

---

# 2. Usuario y Concejal

No se debe crear una entidad `Concejal` separada.

Un concejal es simplemente un `Usuario` cuyo rol es `CONCEJAL`.

## RolUsuario

```prisma
enum RolUsuario {
  ADMIN
  OPERADOR
  CONCEJAL
}
```

## Usuario

```prisma
model Usuario {
  id           Int        @id @default(autoincrement())
  email        String     @unique
  passwordHash String
  nombre       String
  rol          RolUsuario
  activo       Boolean    @default(true)
  creadoEn     DateTime   @default(now())

  idBloque     Int?
  bloque       BloquePolitico? @relation(fields: [idBloque], references: [id])

  normasAutor  NormaAutor[]

  @@map("usuarios")
}
```

---

# 3. Bloque político

`BloquePolitico` sí debe mantenerse como entidad independiente.

Un bloque puede tener varios usuarios/concejales.

```prisma
model BloquePolitico {
  id       Int       @id @default(autoincrement())
  nombre   String    @unique
  sigla    String?
  colorHex String?
  activo   Boolean   @default(true)

  usuarios Usuario[]

  @@map("bloques_politicos")
}
```

`colorHex` es opcional y puede eliminarse si no se necesita para el frontend.

---

# 4. Norma

`Norma` es la entidad central del sistema.

Debe almacenar la información propia de la norma, incluyendo su fecha de sanción.

```prisma
model Norma {
  id            Int         @id @default(autoincrement())
  numero        Int
  anio          Int
  codigoNorma   String
  tipo          TipoNorma
  origen        OrigenNorma
  titulo        String
  fechaSancion  DateTime

  rutaPdf       String?
  hashPdf       String?
  vigente       Boolean     @default(true)

  autores       NormaAutor[]
  temas         NormaTema[]
  estados       RegistroEstado[]

  @@unique([numero, anio, codigoNorma])
  @@map("normas")
}
```

## Tipos de norma

```prisma
enum TipoNorma {
  ORDENANZA
  DECRETO
  RESOLUCION
  COMUNICACION
}
```

## Origen

```prisma
enum OrigenNorma {
  CONCEJO
  EJECUTIVO
}
```

---

# 5. Tema

Se mantiene `Tema` porque una norma puede pertenecer a varios temas y un tema puede estar asociado a muchas normas.

```prisma
model Tema {
  id      Int         @id @default(autoincrement())
  nombre  String      @unique
  normas  NormaTema[]

  @@map("temas")
}
```

## Relación Norma-Tema

```prisma
model NormaTema {
  id       Int   @id @default(autoincrement())
  idNorma  Int
  idTema   Int

  norma    Norma @relation(fields: [idNorma], references: [id], onDelete: Cascade)
  tema     Tema  @relation(fields: [idTema], references: [id], onDelete: Cascade)

  @@unique([idNorma, idTema])
  @@map("normas_temas")
}
```

---

# 6. Autores de las normas

Una norma puede tener varios autores y un concejal puede participar como autor en varias normas.

Por eso se mantiene una tabla intermedia `NormaAutor`.

Como `Concejal` ya no existe, la relación debe ser con `Usuario`.

```prisma
model NormaAutor {
  id          Int      @id @default(autoincrement())
  idNorma     Int
  idUsuario   Int

  norma       Norma    @relation(fields: [idNorma], references: [id], onDelete: Cascade)
  usuario     Usuario  @relation(fields: [idUsuario], references: [id], onDelete: Cascade)

  @@unique([idNorma, idUsuario])
  @@map("normas_autores")
}
```

---

# 7. Períodos

El sistema debe crear automáticamente dos períodos por año:

- Período 1: 1 de enero → 30 de junio.
- Período 2: 1 de julio → 31 de diciembre.

`Periodo` representa solamente el intervalo temporal.

No debe almacenar las normas directamente.

No debe almacenar la fecha de sanción de las normas.

```prisma
model Periodo {
  id            Int      @id @default(autoincrement())
  anio          Int
  numeroPeriodo Int
  fechaInicio   DateTime
  fechaFin      DateTime

  estados       RegistroEstado[]

  @@unique([anio, numeroPeriodo])
  @@map("periodos")
}
```

Ejemplo:

```text
Periodo 2026-1
01/01/2026 → 30/06/2026

Periodo 2026-2
01/07/2026 → 31/12/2026
```

---

# 8. Estado histórico de una norma

Este es el componente que reemplaza al sistema anterior de:

- `Seguimiento`
- `SeguimientoHistorial`
- `EstadoEjecucion`
- `AreaEjecutivo`

No se necesita mantener esas cuatro entidades para el objetivo actual.

Se crea una única entidad `RegistroEstado`.

## Estados

Inicialmente pueden utilizarse:

```prisma
enum EstadoNorma {
  PRESENTADA
  VIGENTE
  PARCIALMENTE_CUMPLIDA
  CUMPLIDA
  INCUMPLIDA
  DEROGADA
}
```

Los estados definitivos pueden reducirse si el proyecto decide utilizar solamente los estados realmente necesarios.

## RegistroEstado

```prisma
model RegistroEstado {
  id           Int          @id @default(autoincrement())
  idNorma      Int
  idPeriodo    Int
  estado       EstadoNorma
  observacion  String?

  norma        Norma        @relation(fields: [idNorma], references: [id], onDelete: Cascade)
  periodo      Periodo      @relation(fields: [idPeriodo], references: [id])

  @@unique([idNorma, idPeriodo])
  @@map("registros_estado")
}
```

---

# 9. Concepto del historial

El historial debe funcionar como una "fotografía" del estado de una norma durante cada período.

Ejemplo:

| Norma | Período | Estado |
|---|---|---|
| Ordenanza 101 | 2026-1 | PRESENTADA |
| Ordenanza 101 | 2026-2 | VIGENTE |
| Ordenanza 101 | 2027-1 | PARCIALMENTE_CUMPLIDA |
| Ordenanza 101 | 2027-2 | CUMPLIDA |

Esto permite saber cómo fue evolucionando una norma sin crear una tabla adicional de historial de cambios.

---

# 10. Relación entre Norma y Período

No se debe interpretar que una norma "pertenece" al período.

La norma existe independientemente del período.

La relación real es:

```text
Norma
  │
  │
  ▼
RegistroEstado
  │
  │
  ▼
Periodo
```

`RegistroEstado` indica:

> "Durante este período, esta norma tenía este estado."

---

# 11. Fecha de sanción y períodos

La fecha de sanción ya está almacenada en:

```prisma
Norma.fechaSancion
```

Por lo tanto, no debe duplicarse.

El sistema puede determinar a qué período pertenece una norma según su fecha de sanción.

Ejemplo:

```text
Norma 150
fechaSancion = 15/03/2026

→ pertenece temporalmente al período 2026-1
```

```text
Norma 151
fechaSancion = 20/10/2026

→ pertenece temporalmente al período 2026-2
```

Sin embargo, esto no significa que el período sea el dueño de la norma.

`RegistroEstado` es el que permite registrar el estado histórico de esa norma en ese período.

---

# 12. Ejemplo completo

Supongamos:

```text
Ordenanza 100
Sancionada: 15/03/2026
```

En el primer período:

```text
2026-1
Estado: PRESENTADA
```

En el segundo:

```text
2026-2
Estado: VIGENTE
```

En el primer período de 2027:

```text
2027-1
Estado: PARCIALMENTE_CUMPLIDA
```

En el segundo:

```text
2027-2
Estado: CUMPLIDA
```

La base almacena:

```text
Norma
  └── Ordenanza 100
       fechaSancion: 15/03/2026

RegistroEstado
  ├── 2026-1 → PRESENTADA
  ├── 2026-2 → VIGENTE
  ├── 2027-1 → PARCIALMENTE_CUMPLIDA
  └── 2027-2 → CUMPLIDA
```

---

# 13. Entidades eliminadas respecto al diseño original

Eliminar:

```text
❌ Concejal
❌ Seguimiento
❌ SeguimientoHistorial
❌ EstadoEjecucion
❌ AreaEjecutivo
```

Reemplazar por:

```text
Usuario
Periodo
RegistroEstado
EstadoNorma
```

---

# 14. Estructura final

La estructura conceptual final queda:

```text
Usuario
   │
   ├── BloquePolitico
   │
   └── NormaAutor
           │
           ▼
         Norma
         /           /        NormaTema  RegistroEstado
      │            │
      ▼            ▼
    Tema         Periodo
```

## Entidades principales

```text
Usuario
BloquePolitico
Norma
Tema
Periodo
RegistroEstado
```

## Entidades intermedias

```text
NormaAutor
NormaTema
```

## Enums

```text
RolUsuario
TipoNorma
OrigenNorma
EstadoNorma
```

---

# 15. Principio de simplificación

No agregar entidades para representar información que ya puede derivarse de otra entidad.

En particular:

- `Concejal` no es necesario porque es un `Usuario` con rol `CONCEJAL`.
- `SeguimientoHistorial` no es necesario porque `RegistroEstado` ya representa el historial por período.
- `EstadoEjecucion` no necesita ser una tabla si los estados son un conjunto cerrado y conocido; puede ser un `enum`.
- `Periodo` no necesita guardar normas directamente.
- `Periodo` no necesita guardar la fecha de sanción.
- `Norma` ya conoce cuándo fue sancionada mediante `fechaSancion`.
- No se debe duplicar información si puede obtenerse mediante relaciones o consultas.

El objetivo es que el modelo represente directamente la lógica del sistema:

**Norma + Período + Estado = historial legislativo de la norma.**
