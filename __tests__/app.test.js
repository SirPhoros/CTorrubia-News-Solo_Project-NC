const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const app = require('../app')

beforeEach(() => {
	return seed(data)
})

afterAll(() => db.end())

describe('GET /api/articles/:article_id', () => {
	test('GET - status 200 - returns an article object of one article', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(1)
			})
	})
	test('GET - status 200 - returns an article object containing the right amount of data', () => {
		return request(app)
			.get('/api/articles/2')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(typeof articles[0].title).toBe('string')
				expect(typeof articles[0].topic).toBe('string')
				expect(typeof articles[0].author).toBe('string')
				expect(typeof articles[0].body).toBe('string')
				expect(typeof articles[0].votes).toBe('number')
				expect(typeof articles[0].article_img_url).toBe('string')
				expect(typeof articles[0].created_at).toBe('string')
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
	test('GET - status 500 - returns error if the article_id is not a number', () => {
		return request(app)
			.get('/api/articles/nonsense')
			.expect(500)
			.then(({ body }) => {
				expect(body.msg).toBe("Server error! We're very sorry")
			})
	})
})
