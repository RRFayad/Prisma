import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(/*{ log: ["query"] }*/); // We can add this log:["query"] to log all the SQL queries - Debug and performance analisys

async function main() {
  // await prisma.user.deleteMany();
  const user = await prisma.user.findMany({ where: { name: "test.com" } });
  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
