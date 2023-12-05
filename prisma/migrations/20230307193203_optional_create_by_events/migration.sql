-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_userId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sport_buddies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
