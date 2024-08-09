import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // prisma logic here
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
