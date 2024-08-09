# Prisma Course

https://www.youtube.com/watch?v=RebA5J-rlwg

#### Intro

- We are going to use Postgres

#### Set Up

- npm i --save-dev prisma typescript ts-node @types/node nodemon

- npx prisma init --datasource-provider postgresql

- Now we have a schema file witha data source, a dotenv with the db url
  - update our db in the .env file

```prisma
 generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- The generator is what will run our prisma schema
  - **Important** The database must be aleready created

#### Defining a Basic Model

- We defined a basic model:

```prisma
model User {
  id Int @id @default(autoincrement())
  name String
}
```

- npx prisma migrate dev --name init

##### Create Prisma CLient

- npm i prisma-client

- Now I can:

  ```javascript
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
  ```
