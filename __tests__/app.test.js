const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const app = require('../app')

beforeEach(() => {
	return seed(data)
})

afterAll(() => db.end())


describe('GET /api', () => {
	test('returns a JSON file with all the information provided by a JSON file', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(typeof body).toBe('object')
				expect(typeof body.endpoints).toBe('string')
			})
	})
})
