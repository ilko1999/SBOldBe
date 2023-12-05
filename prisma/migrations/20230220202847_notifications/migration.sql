/*
  Warnings:

  - A unique constraint covering the columns `[notifUserId]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_eventId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notifUserId_fkey";

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "eventId" DROP NOT NULL,
ALTER COLUMN "notifUserId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "notifications_notifUserId_key" ON "notifications"("notifUserId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notifUserId_fkey" FOREIGN KEY ("notifUserId") REFERENCES "sport_buddies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
