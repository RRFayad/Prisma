# Prisma Course

https://www.youtube.com/watch?v=RebA5J-rlwg

#### Intro

- We are going to use Postgres

#### Set Up

- npm i --save-dev prisma typescript ts-node @types/node nodemon

- npx prisma init --datasource-provider postgresql

- Now we have a schema file witha data source, a dotenv with the db url
  - update our db in the .env file

```javascript
 generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- The generator is what will run our prisma schema

#### Basic Prisma Model Setup

-
