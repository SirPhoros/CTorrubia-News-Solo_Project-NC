# CTORRUBIA - SoloProject - Northcoders News API

## Background

This repo will contain the back-end solo project proposed by the Northcoders Full-Stack bootcamp, in this project I will make use of my knowledge of back-end tools to mimic a back-end service.

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
You will need to create two .env files for your project: `.env.test` and `.env.development.` Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these `.env files` are `.gitignored`.
