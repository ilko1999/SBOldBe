/*
  Warnings:

  - Made the column `userId` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_eventId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sport_buddies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
