-- CreateTable
CREATE TABLE "Concejal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Concejal_pkey" PRIMARY KEY ("id")
);
