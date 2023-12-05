-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "sport_buddies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT DEFAULT '',
    "profileName" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "userPhoto" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "socketId" TEXT DEFAULT '',
    "website" TEXT DEFAULT '',
    "igTag" TEXT DEFAULT '',
    "ytTag" TEXT DEFAULT '',
    "organizationId" TEXT,

    CONSTRAINT "sport_buddies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "achievmentPhoto" TEXT NOT NULL,
    "achievmentDescription" TEXT NOT NULL,
    "achievmentName" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "achievments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT DEFAULT '',
    "profileName" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "userPhoto" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "socketId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "maxPpl" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "userRequestingToJoinId" TEXT,
    "orgUserId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAdditions" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nameOfTheEvent" TEXT NOT NULL,
    "eventCoverPhoto" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventAdditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_usersRequestingToJoin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SportToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "sport_buddies_email_key" ON "sport_buddies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sport_buddies_profileName_key" ON "sport_buddies"("profileName");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_profileName_key" ON "organizations"("profileName");

-- CreateIndex
CREATE UNIQUE INDEX "events_userRequestingToJoinId_key" ON "events"("userRequestingToJoinId");

-- CreateIndex
CREATE UNIQUE INDEX "EventAdditions_eventId_key" ON "EventAdditions"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToLocation_AB_unique" ON "_EventToLocation"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToLocation_B_index" ON "_EventToLocation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_usersRequestingToJoin_AB_unique" ON "_usersRequestingToJoin"("A", "B");

-- CreateIndex
CREATE INDEX "_usersRequestingToJoin_B_index" ON "_usersRequestingToJoin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "_EventToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUser_B_index" ON "_EventToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SportToUser_AB_unique" ON "_SportToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SportToUser_B_index" ON "_SportToUser"("B");

-- AddForeignKey
ALTER TABLE "sport_buddies" ADD CONSTRAINT "sport_buddies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievments" ADD CONSTRAINT "achievments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sport_buddies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sport_buddies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_orgUserId_fkey" FOREIGN KEY ("orgUserId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAdditions" ADD CONSTRAINT "EventAdditions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToLocation" ADD CONSTRAINT "_EventToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToLocation" ADD CONSTRAINT "_EventToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersRequestingToJoin" ADD CONSTRAINT "_usersRequestingToJoin_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersRequestingToJoin" ADD CONSTRAINT "_usersRequestingToJoin_B_fkey" FOREIGN KEY ("B") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SportToUser" ADD CONSTRAINT "_SportToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SportToUser" ADD CONSTRAINT "_SportToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
