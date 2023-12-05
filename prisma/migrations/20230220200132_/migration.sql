/*
  Warnings:

  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `notifUserId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "userId",
ADD COLUMN     "notifUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notifUserId_fkey" FOREIGN KEY ("notifUserId") REFERENCES "sport_buddies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
