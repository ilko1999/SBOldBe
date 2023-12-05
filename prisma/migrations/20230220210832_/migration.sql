/*
  Warnings:

  - A unique constraint covering the columns `[notifUserInId]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "notifUserInId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "notifications_notifUserInId_key" ON "notifications"("notifUserInId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notifUserInId_fkey" FOREIGN KEY ("notifUserInId") REFERENCES "sport_buddies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
