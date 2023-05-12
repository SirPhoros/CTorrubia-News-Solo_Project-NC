# CTORRUBIA - Northcoders News API

## Background

**CTORRUBIA - Northcoders News API** is a [node-postgres](https://node-postgres.com/) back-end API for a Reddit-style news website. The intention here was to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

The database used was PSQL, and interactions have been carried out using node-postgres.

> A live version can be accessed here: https://nc-news-soloproject-be.onrender.com/

Written by [Cristóbal G. Torrubia](https://github.com/SirPhoros). Latest version 1.0.0 (12 May 2023).

This project has been part of the Northcoders bootcamp, 27th March 2023 - 23rd June 2023.

---

## Set-up guide

### 1. Install dependencies

```
$ npm i
$ npm i -D jest
$ npm i -D jest-sorted
```

At a minimum, [Node.js v19.7.0](https://nodejs.org/en/download/) and [PostgreSQL 14.7](https://www.postgresql.org/download/) are required. Postgres will be installed with the command above.

### 2. Set environment variables

Create two `.env` files, `.env.development` and `.env.test`, which should read respectively:

```
PGDATABASE=nc_news
```

```
PGDATABASE=nc_news_test
```

### 3. Set-up and seed the databases

```
$ npm run setup-dbs
$ npm run seed
```

The databases can now be accessed via `psql`.

---

## Testing

To run the provided test suite:

```
$ npm t 
```

To run the dev environment:

```
$ npm run dev
```

---

## Available endpoints

### `GET /api/`

- Retrieves a JSON object of available endpoints in the API

### `GET /api/topics`

- Retrieves a list of topics

### `GET /api/articles`

- Retrieves a list of articles

### `GET /api/articles/:article_id`

- Retrieves an individual article, along with the number of comments associated with it

### `PATCH /api/articles/:article_id`

- Increments the article's `votes` property by the `inc_votes` property in the request body
- Example request body:

```
{ inc_votes: 1 }
```

### `GET /api/articles/:article_id/comments`

- Retrieves a list of comments associated with the given `article_id`

### `POST /api/articles/:article_id/comments`

- Adds a comment to the database, associated with the given `article_id`
- Example request body:

```
{ username: "jessjelly", body: "I love this site!" };
```

### `DELETE /api/comments/:comment_id`

- Deletes the specified comment from the database

### `GET /api/users`

- Retrieves a list of users currently registered to the site.`

### `GET /api/users/:username`

- Retrieves an individual user object `
- `:username` must be valid and exist
- Example response body:

```
{
	"user": {
		"username": "jessjelly",
		"avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
		"name": "Jess Jelly"
	}
}
```

---

Copyright (c) 2023
