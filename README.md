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
- npx prisma generate
  - Rememring it regenerates the prisma client (which will help us with types and dx)
  - Sometimes it does not work giving us the types, so we can reload the window or inspect the generated TS file

#### Create

```typescript
async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Renan",
      email: "test.com",
      age: 34,
    },
  });
  console.log(user);
}
```

- We can also add a include and select to manipulate the returned results

```typescript
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
```

##### Add Many

- We could have used createMany and populate data with an array `const user = await prisma.user.createMany({data:[{}, {}, {}]})`
  - In createMany we can't use select

#### Read Data

##### findUnique():

```typescript
const user = await prisma.user.findUnique({ where: { email: "test.com" } });
```

- As in our model we defined as block-level the unique `@@unique([age, name])`, prisma wgives us this option:

```typescript
const user = await prisma.user.findUnique({ where: { age_name: { age: 34, name: "lorem" } } });
```

##### findFirst():

- We can not use findUnique for an attribute that is not unique, so we can use findFirst()

##### fidnMany()

- Returns an array of all the users that matches the where filter

##### Filters

- distinct
  - will return only the first element that attend that distinct rule

```typescript
const user = await prisma.user.findMany({
  where: {
    name: "Renan",
    age: 32,
  },
  // distinct: ["name"],   // Will return only the first "Renan"
  distinct: ["name", "age"], // Will return only the first "Renan" who is 32
});
```

- pagination

```typescript
const user = await prisma.user.findMany({
  where: {
    name: "Renan",
  },
  orderBy: {
    age: "desc" | "asc"
  }
  take: 2, // Will return 2 users that name Renan,
  skip: 1 // Skip the first Renan
});
```

#### Advanced Filtering

- More 'complex' where:

  - equals (in this case its the same result as where:{name:"Renan"})
    ```typescript
    const user = await prisma.user.findMany({
      where: {
        name: { equals: "Renan" },
      },
    });
    ```
  - not - that are different from the added value (in this case i reurns all users not named "Renan")
    ```typescript
    const user = await prisma.user.findMany({
      where: {
        name: { not: "Renan" },
      },
    });
    ```
  - in - all the data which value matches the arrays
    ```typescript
    const user = await prisma.user.findMany({
      where: {
        name: { in: ["Renan", "Lorem"] },
      },
    });
    ```
  - notIn - all the data which value is diffrerent from the array's values
  - lt: - Less Than e.g. `where:{age: {lt: 20}}`
  - lte: - Less Than or Equal e.g. `where:{age: {lte: 20}}`
  - gt: Greater Than
  - gt: Greater Than or Equal
  - contains: contains a srintg snippet e.g. `where:{email: {contains: "@gmail.com"}}`
  - endsWith: constains a string that ends with e.g. `where:{email: {endsWith: "@gmail.com"}}`
  - startsWith: constains a string that ends with e.g. `where:{email: {startsWith: "test@"}}`

  - AND:[{}]: Define logics that all must match, e.g.: `where: {AND:[{ email: {startsWith: "test1" } }, {email: {endsWith: "@gmail.com" } } ]}`
  - OR:[{}]: Same for OR, e.g.: `where: {OR:[{ email: {endsWith: "@hotmail.com" } }, {email: {endsWith: "@gmail.com" } } ]}`
  - NOT:[{}]: Same, but negating
