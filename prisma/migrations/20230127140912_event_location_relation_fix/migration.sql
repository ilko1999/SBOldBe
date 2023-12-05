/*
  Warnings:

  - You are about to drop the `_EventToLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EventToLocation" DROP CONSTRAINT "_EventToLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToLocation" DROP CONSTRAINT "_EventToLocation_B_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "locationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_EventToLocation";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
