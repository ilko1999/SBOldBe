import { sports } from './sports';
import { PrismaClient } from '@prisma/client';
import { achievments } from './achievments';
import { locations } from './locations';

const prisma = new PrismaClient();

async function main() {
    for (let sport of sports) {
        await prisma.sport.create({
            data: sport,
        });
    }

    for (let achievment of achievments) {
        await prisma.achievment.create({
            data: achievment,
        });
    }

    for (let location of locations) {
        await prisma.location.create({
            data: location,
        });
    }
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
