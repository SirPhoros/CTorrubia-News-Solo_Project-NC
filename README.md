# CTORRUBIA - SoloProject - Northcoders News API

## Background

This repo contains the back-end solo project proposed by the Nortcoders Full-Stack bootcamp. In the project, I will make use of my knowledge with back-end tools, using NODE.js, Express and PSQL as main rules, and testing according to the TDD rules. The project will be complemented with a Front-End project, by the end of the course, granting then with a Back-End and a Front-End version of the project.

The project consists on the building of an API for the purpose of accessing application data programatically. Thus, the intention of this is to mimic the building of a real world backend service (such as reddit), which should latter on provide the information to the front end architecture.

## Hosted version of the Project

TBC

## Set-up

If you want to use it and test this project yourself, you need to start by:

1. Fork this repository to your own GitHub account because you will be pushing your own solutions to it.

2. Clone your fork of this repository to your local machine and `cd` into it:

```
$ git clone <your fork's URL>
$ cd be-nc-news-CGT
```

3. Make sure you've navigated into the folder and install all dependencies using `npm install`. You also have access to an npm script to run tests (`npm test`).

If you as an user want to have a look to this project, you will first need to set-up your folder once you have cloned it. To do so:
You will need to create two .env files for your project: `.env.test` and `.env.development.` Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these `.env files` are `.gitignored` (you could use `.env.*` to englobe both .env files in the same ignore).

4. Once you have configured the .env files, you are ready to seed database. To do so, you can check `package.json`, in which you will find the scripts `setup-dbs` and `seed`, in order to use them, type `npm run <script-name>` in your console.

```
$ npm run setup-dbs
$ npm run seed
```

Once you have done it, you are ready to go. You also have access to an npm script to run tests (`npm test`).

## Minimum Requirements

This project has been realised with the versions of *Node.js* `v19.7.0`, *Postgres* `PostgreSQL 14.7`

Along with that, the project has been done with the help of the packages `dotenv`, `express` & `pg`; and if you want to use the tests provided by the project, you will need to install in your devDependencies `supertest` and `jest-sorted`. 

Hint: Remember that you'll need create a .env.development file (use the example.env as a template) and then run the setup.sql file to create the databases firstTo install a package in your *devDependencies* type in your console `npm install -d <name-of-package>`.
