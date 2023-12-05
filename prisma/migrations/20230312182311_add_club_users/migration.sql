-- CreateTable
CREATE TABLE "_ClubToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToUser_AB_unique" ON "_ClubToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToUser_B_index" ON "_ClubToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "sport_buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
