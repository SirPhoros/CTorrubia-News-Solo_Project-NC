const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const app = require('../app')
const endpoints = require('../endpoints.json')
const { expect } = require('@jest/globals')

beforeEach(() => {
	return seed(data)
})

afterAll(() => db.end())

describe('GET /api/topics', () => {
	test('GET - status 200 - returns an array containing the right amount of data', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3)
			})
	})

	test('GET - status 200 - returns an array containing the right type of data (slug; description)', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				body.topics.forEach((topic) => {
					expect(typeof topic.slug).toBe('string')
					expect(typeof topic.description).toBe('string')
				})
			})
	})
})

describe('GET /api', () => {
	test('returns a JSON file with all the information provided by a JSON file', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then((data) => {
				expect(data.body).toEqual(endpoints)
			})
	})
})

describe('GET /api/articles/:article_id', () => {
	test('GET - status 200 - returns an article object of one article', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article.length).toBe(1)
			})
	})
	test('GET - status 200 - returns an article object containing the right amount of data', () => {
		return request(app)
			.get('/api/articles/2')
			.expect(200)
			.then(({ body: { article } }) => {
				expect(typeof article[0].title).toBe('string')
				expect(typeof article[0].topic).toBe('string')
				expect(typeof article[0].author).toBe('string')
				expect(typeof article[0].body).toBe('string')
				expect(typeof article[0].votes).toBe('number')
				expect(typeof article[0].article_img_url).toBe('string')
				expect(typeof article[0].created_at).toBe('string')
			})
	})
	test('GET - status 404 - returns error if article is not found', () => {
		return request(app)
			.get('/api/articles/10000')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('No article found with that ID')
			})
	})
	test('GET - status 400 - returns error if the article_id is not a number', () => {
		return request(app)
			.get('/api/articles/nonsense')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
})

describe('GET /api/articles', () => {
	test('GET - status 200 - returns an array containing the right type of data [author, title, article_id, topic, created_at, votes, article_img_url, comment_count] of the right type', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(5)
				body.articles.forEach((article) => {
					expect(article.hasOwnProperty('author'))
					expect(typeof article.author).toBe('string')
					expect(article.hasOwnProperty('title'))
					expect(typeof article.title).toBe('string')
					expect(article.hasOwnProperty('article_id'))
					expect(typeof article.article_id).toBe('number')
					expect(article.hasOwnProperty('topic'))
					expect(typeof article.topic).toBe('string')
					expect(article.hasOwnProperty('created_at'))
					expect(typeof article.created_at).toBe('string')
					expect(article.hasOwnProperty('votes'))
					expect(typeof article.votes).toBe('number')
					expect(article.hasOwnProperty('article_img_url'))
					expect(typeof article.article_img_url).toBe('string')
					//https://www.postgresql.org/docs/8.2/functions-aggregate.html It will return it as a string, unless COUNT(*)::INT
					expect(article.hasOwnProperty('comment_count'))
					expect(typeof article.comment_count).toBe('number')
					//has not own property 'body'
					expect(article.hasOwnProperty('body')).toBe(false)
				})
			})
	})
	test('GET - status 200 - returns an array ordered by date, descending', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', {
					descending: true,
				})
				expect(body.articles).not.toBeSortedBy('votes')
			})
	})
})

describe('POST /api/articles/:article_id/comments', () => {
	test('POST - Status: 201 - responds with an object with required properties and sends back the posted comment', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				username: 'icellusedkars',
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
			})
			.expect(201)
			.then(({ body: { comment } }) => {
				//First version of testing objects
				expect(comment).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						body: expect.any(String),
					})
				)
				//Second version of testing objects
				expect(comment).toMatchObject({
					comment_id: 19,
					body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
					article_id: 1,
					author: 'icellusedkars',
					votes: 0,
				})
			})
	})
	test('POST - Status: 201 - responds with an object despite having unnecesarry properties', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				username: 'icellusedkars',
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
				nonsense: 10,
			})
			.expect(201)
			.then(({ body: { comment } }) => {
				expect(comment).toEqual(expect.not.objectContaining({ nonsense: 10 }))
			})
	})

	test('POST - Status: 404 - responds with an error if user not found', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				username: 'icellusedkars',
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(
					'Bad request: The body of the comment is required'
				)
			})
	})
	test('POST - Status: 404 - responds with an error if user not found', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(
					'Bad request: An username to attribute this comment is required'
				)
			})
	})

	test('POST - Status: 404 - responds with an error if user not found', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				username: 'Demiurge',
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
			})
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('One of your parameters is not found')
			})
	})
	test('POST - status 404 - returns error if article is not found', () => {
		return request(app)
			.post('/api/articles/10000/comments')
			.send({
				username: 'icellusedkars',
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
			})
			.expect(404)
			.then(({ body }) => {
				//Goes to the app.all as it tries to post access to /articles/10000/comments but as said article does not exist, it will trigger that error. 
				//Because it has the same code error as another error, I had to modify the response so it matches the need of both tests. 
				expect(body.msg).toBe('One of your parameters is not found')
			})
	})
	test('POST - status 400 - returns error if the article_id is not a number', () => {
		return request(app)
			.post('/api/articles/nonsense/comments')
			.send({
				username: 'icellusedkars',
				body: 'This is a test comment, I am existing briefly to prove the existence of this endpoint.',
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
})

describe('ERROR 404 - Non valid endpoint', () => {
	test('returns an error message if a non-valid endpoint is introduced', () => {
		return request(app)
			.get('/api/nonsense')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('endpoint not found')
			})
	})
})
