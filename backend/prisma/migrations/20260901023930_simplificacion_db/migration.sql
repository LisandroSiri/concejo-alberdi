-- DropIndex
DROP INDEX "registros_estado_idNorma_idPeriodo_key";

-- AlterTable
ALTER TABLE "registros_estado" ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "registros_estado_idNorma_creadoEn_idx" ON "registros_estado"("idNorma", "creadoEn");
