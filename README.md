# Prisma Course

https://www.youtube.com/watch?v=RebA5J-rlwg

### Intro

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

### Schema

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
    const user = await prisma.user.create({ data: { name: "Renan" } });
  }

  main()
    .catch((e) => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
  ```

  - And that's how prisma works overall, with the prisma file handling the generator, the db connectoin and the schemas (which defines our types and DBs schemas)

#### Models

- each model define a table in my db:

```prisma
model User {
  id Int @id @default(autoincrement())
  name String
  email String?
  isAdmin Boolean
  largeNumber BigInt
  preferences Json
  blob Bytes  // File data?
  blob2 Unsupported("") // Very specifc
}

model Post {
  rating Float
  decimalNumber Decimal
  createdAt DateTime
}
```

- It has 4 parts:
  - name (id, name, email etc);
  - types (some examples above)
  - modifier (only [] or ?)
  - attribures (starts with @)

#### Relations

- One to Many (a post has 1 author, 01 author has many posts);
- Many to Many (One post has many categories, each category has many posts);
- One-to-One (One User has a table of preferences, each table of preferences has only oe user)

##### One-to-Many Relationship

```prisma
model User {
  id String @id @default(uuid())
  name String
  email String
  isAdmin Boolean
  preferences Json
  posts Post[]    // Modifiers: [] or ? only

}

model Post {
  id Int @id @default(autoincrement())
  rating Float
  createdAt DateTime
  updatedAt DateTime
  author User @relation(fields: [authorId], references: [id]) // fields says what fields in this model have the relation and reference, what is referenced attribute
  authorId String
}
```

##### Multiple One-to-Many Relationships

```prisma
  model User {
  id String @id @default(uuid())
  name String
  email String
  isAdmin Boolean
  preferences Json
  writtenPosts Post[] @relation("WrittenPostsOrWhatever")
  favoritePosts Post[]  @relation("FavPost")

}

model Post {
  id Int @id @default(autoincrement())
  rating Float
  createdAt DateTime
  updatedAt DateTime
  author User @relation("WrittenPostsOrWhatever", fields: [authorId], references: [id])
  authorId String
  favotiredBy User? @relation("FavPost",fields: [favotiredById], references: [id])
  favotiredById String?
}
```

##### Many-to-Many Relationships

```prisma
  model Post {
  id Int @id @default(autoincrement())
  rating Float
  createdAt DateTime
  updatedAt DateTime
  author User @relation("WrittenPostsOrWhatever", fields: [authorId], references: [id]) // fields says what fields in this model have the relation and reference, what is referenced attribute
  authorId String
  favotiredBy User? @relation("FavPost",fields: [favotiredById], references: [id]) // fields says what fields in this model have the relation and reference, what is referenced attribute
  favotiredById String?
  categories Category[] // Enough for the many-to-many relation
}

model Category {
  id String @id @default(uuid())
  posts Post[]
}
```

##### One-to-One Relation

```prisma
  model User {
  id             String          @id @default(uuid())
  name           String
  email          String
  isAdmin        Boolean
  preferences    Json
  writtenPosts   Post[]          @relation("WrittenPostsOrWhatever") // Modifiers: [] or ? only
  favoritePosts  Post[]          @relation("FavPost") // Modifiers: [] or ? only
  UserPreference UserPreference?
}

model UserPreference {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user         User    @relation(fields: [userId], references: [id])
  userId       String  @unique
}
```

#### Attributes

- Field Level and BLock Level Attributes

- Field-level - For each field:

  - @relation(), @id, @unique, @default(), @updatedAt

- Block Level - for the whole model
  - `@@unique([age, name])`, `@@id([title, authorId])`

#### Enums

- A great way of setting a list of values, e.g.:

```prisma
model User {
    role           Role            @default(BASIC)
  }
  enum Role {
    BASIC
    ADMIN
  }
```

### DB Operations

- npx prisma migrate dev
