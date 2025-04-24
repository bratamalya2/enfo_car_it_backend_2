/*
  Warnings:

  - You are about to drop the column `checkInTime` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `currentWarehouseId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `distanceTravelled` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `hrsWorked` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Warehouse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_currentWarehouseId_fkey";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "checkInTime",
DROP COLUMN "currentWarehouseId",
DROP COLUMN "distanceTravelled",
DROP COLUMN "hrsWorked",
ADD COLUMN     "checkedIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "totalKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "warehouseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "agentId" INTEGER,
ADD COLUMN     "assigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "durationMin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "warehouseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_phone_key" ON "Agent"("phone");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
