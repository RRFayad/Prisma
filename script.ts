import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(/*{ log: ["query"] }*/); // We can add this log:["query"] to log all the SQL queries - Debug and performance analisys

async function main() {
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      name: "Renan",
      email: "test.com",
      age: 34,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    // include: { userPreference: true }, // Will include relation values
    select: {
      name: true, // Will define which columns I want to return
      userPreference: { select: { id: true } }, // Bringing the relation in the select
    },
  });
  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
