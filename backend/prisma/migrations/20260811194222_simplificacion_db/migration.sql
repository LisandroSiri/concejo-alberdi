/*
  Warnings:

  - You are about to drop the column `año` on the `normas` table. All the data in the column will be lost.
  - You are about to drop the column `idConcejal` on the `normas_autores` table. All the data in the column will be lost.
  - You are about to drop the column `año` on the `periodos` table. All the data in the column will be lost.
  - You are about to drop the column `vigente` on the `periodos` table. All the data in the column will be lost.
  - You are about to drop the `concejales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estados_ejecucion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seguimientos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seguimientos_historiales` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numero,anio,codigoNorma]` on the table `normas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idNorma,idUsuario]` on the table `normas_autores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anio,numeroPeriodo]` on the table `periodos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anio` to the `normas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUsuario` to the `normas_autores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anio` to the `periodos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoNorma" AS ENUM ('PRESENTADA', 'VIGENTE', 'PARCIALMENTE_CUMPLIDA', 'CUMPLIDA', 'INCUMPLIDA', 'DEROGADA');

-- AlterEnum
ALTER TYPE "RolUsuario" ADD VALUE 'CONCEJAL';

-- DropForeignKey
ALTER TABLE "concejales" DROP CONSTRAINT "concejales_idBloque_fkey";

-- DropForeignKey
ALTER TABLE "normas_autores" DROP CONSTRAINT "normas_autores_idConcejal_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos" DROP CONSTRAINT "seguimientos_idAreaResponsable_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos" DROP CONSTRAINT "seguimientos_idEstado_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos" DROP CONSTRAINT "seguimientos_idNorma_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos" DROP CONSTRAINT "seguimientos_idPeriodo_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos_historiales" DROP CONSTRAINT "seguimientos_historiales_idEstadoAnterior_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos_historiales" DROP CONSTRAINT "seguimientos_historiales_idEstadoNuevo_fkey";

-- DropForeignKey
ALTER TABLE "seguimientos_historiales" DROP CONSTRAINT "seguimientos_historiales_idSeguimiento_fkey";

-- DropIndex
DROP INDEX "normas_numero_año_codigoNorma_key";

-- DropIndex
DROP INDEX "normas_autores_idNorma_idConcejal_key";

-- DropIndex
DROP INDEX "periodos_año_numeroPeriodo_key";

-- AlterTable
ALTER TABLE "normas" DROP COLUMN "año",
ADD COLUMN     "anio" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "normas_autores" DROP COLUMN "idConcejal",
ADD COLUMN     "idUsuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "periodos" DROP COLUMN "año",
DROP COLUMN "vigente",
ADD COLUMN     "anio" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "idBloque" INTEGER;

-- DropTable
DROP TABLE "concejales";

-- DropTable
DROP TABLE "estados_ejecucion";

-- DropTable
DROP TABLE "seguimientos";

-- DropTable
DROP TABLE "seguimientos_historiales";

-- CreateTable
CREATE TABLE "registros_estado" (
    "id" SERIAL NOT NULL,
    "idNorma" INTEGER NOT NULL,
    "idPeriodo" INTEGER NOT NULL,
    "estado" "EstadoNorma" NOT NULL,
    "observacion" TEXT,
    "idArea" INTEGER,

    CONSTRAINT "registros_estado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registros_estado_idNorma_idPeriodo_key" ON "registros_estado"("idNorma", "idPeriodo");

-- CreateIndex
CREATE UNIQUE INDEX "normas_numero_anio_codigoNorma_key" ON "normas"("numero", "anio", "codigoNorma");

-- CreateIndex
CREATE UNIQUE INDEX "normas_autores_idNorma_idUsuario_key" ON "normas_autores"("idNorma", "idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "periodos_anio_numeroPeriodo_key" ON "periodos"("anio", "numeroPeriodo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_idBloque_fkey" FOREIGN KEY ("idBloque") REFERENCES "bloques_politicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "normas_autores" ADD CONSTRAINT "normas_autores_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_estado" ADD CONSTRAINT "registros_estado_idNorma_fkey" FOREIGN KEY ("idNorma") REFERENCES "normas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_estado" ADD CONSTRAINT "registros_estado_idPeriodo_fkey" FOREIGN KEY ("idPeriodo") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_estado" ADD CONSTRAINT "registros_estado_idArea_fkey" FOREIGN KEY ("idArea") REFERENCES "areas_ejecutivo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
