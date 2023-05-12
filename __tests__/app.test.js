const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const app = require('../app')
const endpoints = require('../endpoints.json')
const { expect } = require('@jest/globals')
const { forEach } = require('../db/data/test-data/articles')

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
describe('GET /api/articles/:article_id - Query Implementation', () => {
	test('GET - status 200 - returns an article object of one article', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article.length).toBe(1)
				expect(article.hasOwnProperty('comment_count')).toBe(false)
			})
	})
	test('GET - status 200 - returns an article object of one article', () => {
		return request(app)
			.get('/api/articles/1?count=comments')
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article.length).toBe(1)
				expect(article.hasOwnProperty('comment_count'))
				expect(typeof article[0].comment_count).toBe('number')
			})
	})
})
describe('GET /api/articles/:article_id/comments', () => {
	test('GET - status 200 - returns an article object of one article', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(10) // After Limit Feature Applied - Total of 11.
			})
	})
	test('GET - status 200 - returns an article object containing the right amount of data', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe('number')
					expect(typeof comment.created_at).toBe('string')
					expect(typeof comment.votes).toBe('number')
					expect(typeof comment.author).toBe('string')
					expect(typeof comment.body).toBe('string')
					expect(typeof comment.article_id).toBe('number')
				})
			})
	})
	test('GET - status 200 - returns an empty array if the article has no comments', () => {
		return request(app)
			.get('/api/articles/2/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toEqual([])
			})
	})

	test('GET - status 404 - returns error if article is not found', () => {
		return request(app)
			.get('/api/articles/10000/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('No article found with that ID')
			})
	})
	test('GET - status 400 - returns error if the article_id is not a number', () => {
		return request(app)
			.get('/api/articles/nonsense/comments')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
	test('GET - status 200 - returns newest comment first', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toBeSorted({ descending: true })
				expect(comments).toBeSortedBy('created_at', {
					descending: true,
				})
				expect(comments).not.toBeSortedBy('created_at', {
					ascending: true,
				})
				expect(comments).not.toBeSortedBy('votes')
			})
	})
	test('GET - Easter Egg', () => {
		return request(app)
			.get('/api/articles/teapot/comments')
			.expect(418)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Hi, I'm just a tiny teapot!")
			})
	})
})
describe('GET /api/articles/:article_id/comments - Pagination', () => {
	test('GET - status 200 - returns an array with the pagination in default settings (a page of 10 items)', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(10)
			})
	})
	test('GET - status 200 - returns an array with the pagination in personalised settings (a page of 12 items)', () => {
		return request(app)
			.get('/api/articles/1/comments?limit=11')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(11)
			})
	})
	test('GET - status 200 - returns maximun the element even if it smaller than the limit', () => {
		return request(app)
			.get('/api/articles/1/comments?limit=50')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(11)
			})
	})
	test('GET - status 200 - returns an array with the pagination in default settings, second page', () => {
		return request(app)
			.get('/api/articles/1/comments?p=2')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(1)
			})
	})
	test('GET - status 200 - returns an array with the pagination in personalised settings, third page', () => {
		return request(app)
			.get('/api/articles/1/comments?limit=3&p=3')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(3)
			})
	})
	test('GET - status 404 - returns an empty object if the user tries to navigate an empty page (excession of elements) ', () => {
		return request(app)
			.get('/api/articles/1/comments?limit=50&p=3')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toEqual([])
			})
	})
})
describe('GET /api/users', () => {
	test('GET - status 200 - returns an array containing the right amount of data', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body: { users } }) => {
				expect(users.length).toBe(4)
			})
	})

	test('GET - status 200 - returns an array containing the right type of data [username, name, avatar_url]', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body: { users } }) => {
				users.forEach((user) => {
					expect(user.hasOwnProperty('username'))
					expect(typeof user.username).toBe('string')
					expect(user.hasOwnProperty('name'))
					expect(typeof user.name).toBe('string')
					expect(user.hasOwnProperty('avatar_url'))
					expect(typeof user.avatar_url).toBe('string')
				})
			})
	})
})

describe('GET /api/users/:username', () => {
	test('GET - status 200 - returns an user object that matches the username', () => {
		return request(app)
			.get('/api/users/butter_bridge')
			.expect(200)
			.then(({ body: { user } }) => {
				expect(user.length).toBe(1)
			})
	})
	test('GET - status 200 - returns an article object containing the right type of data [username, user, avatar_url]', () => {
		return request(app)
			.get('/api/users/butter_bridge')
			.expect(200)
			.then(({ body: { user } }) => {
				//First version of testing objects
				expect(user[0]).toEqual(
					expect.objectContaining({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					})
				)
				//Second version of testing objects
				expect(user[0]).toMatchObject({
					username: 'butter_bridge',
					name: 'jonny',
					avatar_url:
						'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
				})
			})
	})
	//Only we will get Error 404, as anything passed as req.params will be treated as string.
	//Future Feature: limit with a REGEX what elements can have -->> it will send a 400.
	test('GET - status 404 - returns error if user is not found', () => {
		return request(app)
			.get('/api/users/demiurge')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('No user found with that username')
			})
	})
})

describe('PATCH /api/articles/:article_id', () => {
	test('PATCH - status 202 - if no vote is send, returns the same vote', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 0 })
			.then(({ body: { article } }) => {
				expect(article.votes).toBe(100)
			})
	})
	test('PATCH - status 202 - if a number is sent, vote increments in that number', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 10 })
			.expect(202)
			.then(({ body: { article } }) => {
				expect(article.votes).toBe(110)
			})
	})
	test('PATCH - status 202 - if a negativenumber is sent, vote decrements in that number', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: -10 })
			.expect(202)
			.then(({ body: { article } }) => {
				expect(article.votes).toBe(90)
			})
	})
	test('PATCH - status 404 - if an invalid ID is introduced.', () => {
		return request(app)
			.patch('/api/articles/100000')
			.send({ inc_votes: 1 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Article not found')
			})
	})
	test('PATCH - status 400 - if a invalid ID is inserted in the URL, an error is sent.', () => {
		return request(app)
			.patch('/api/articles/nonsense')
			.send({ inc_votes: -10 })
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
	test('PATCH - status 400 - if a non-number is passed as the inc_votes value.', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 'number' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Introduce a whole number')
			})
	})
	test('PATCH - status 400 - if user tries to update an invalid category, it returns an error.', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ nonsense: 1 })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid category to be Updated')
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
				expect(body.msg).toBe(
					'One of your parameters does not exist in our database'
				)
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
				expect(body.msg).toBe(
					'One of your parameters does not exist in our database'
				)
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

describe('DELETE /api/comments/:comment_id', () => {
	test('DELETE - status: 204 - responds with right status code', () => {
		return request(app).delete('/api/comments/1').expect(204)
	})
	test('DELETE - status: 400 - returns an error if user tries to insert a non-numerical (whole) ID', () => {
		return request(app)
			.delete('/api/comments/nonsense')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
	test('DELETE - status: 400 - returns an error if the ID is out of scope for the type of data', () => {
		return request(app)
			.delete('/api/comments/9999999999')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(
					'Bad request: ID is out of range for type integer'
				)
			})
	})
	test('DELETE - status: 404 - returns an error if there is no comment with that ID', () => {
		return request(app)
			.delete('/api/comments/999')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('No article found with that ID')
			})
	})
})
describe('PATCH /api/comments/:comment_id', () => {
	test('PATCH - status 202 - if no vote is send, returns the same vote', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: 0 })
			.then(({ body: { comment } }) => {
				expect(comment.votes).toBe(16)
			})
	})
	test('PATCH - status 202 - if a number is sent, vote increments in that number', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: 10 })
			.expect(202)
			.then(({ body: { comment } }) => {
				expect(comment.votes).toBe(26)
			})
	})
	test('PATCH - status 202 - if a negative number is sent, vote decrements in that number', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: -10 })
			.expect(202)
			.then(({ body: { comment } }) => {
				expect(comment.votes).toBe(6)
			})
	})
	test('PATCH - status 404 - if an invalid ID is introduced.', () => {
		return request(app)
			.patch('/api/comments/100000')
			.send({ inc_votes: 1 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Comment not found')
			})
	})
	test('PATCH - status 400 - if a invalid ID is inserted in the URL, an error is sent.', () => {
		return request(app)
			.patch('/api/comments/nonsense')
			.send({ inc_votes: -10 })
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Not valid type of input')
			})
	})
	test('PATCH - status 400 - if a non-number is passed as the inc_votes value.', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: 'number' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Introduce a whole number')
			})
	})
	test('PATCH - status 400 - if user tries to update an invalid category, it returns an error.', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ nonsense: 1 })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid category to be Updated')
			})
	})
})

describe('GET /api/articles', () => {
	test('GET - status 200 - returns an array containing the right type of data [author, title, article_id, topic, created_at, votes, article_img_url, comment_count] of the right type', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(10) // After Limit Feature Applied - Total of 12.
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
	test('GET - status 200 - returns an array sort_by: date (default), order: default (descending)', () => {
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
describe('GET /api/articles - Queries Handling', () => {
	test('GET - status 200 - returns an array sort_by: author, order: default (descending)', () => {
		return request(app)
			.get('/api/articles?sort_by=author')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy('author', {
					descending: true,
				})
				expect(articles).not.toBeSortedBy('comment_count') // Check votes, I think it broke
			})
	})
	test('GET - status 200 - returns an array sort_by: author, order: ascending', () => {
		return request(app)
			.get('/api/articles?sort_by=author&order=asc')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy('author', {
					ascending: true,
				})
				expect(articles).not.toBeSortedBy('votes')
			})
	})
	test('GET - status 200 - returns an array sort_by: comment_count (aggregate function), order: ascending', () => {
		return request(app)
			.get('/api/articles?sort_by=comment_count&order=asc')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy('comment_count', {
					ascending: true,
				})
				expect(articles).not.toBeSortedBy('author')
			})
	})
	test('GET - status 200 - returns an array filter topic: cats', () => {
		return request(app)
			.get('/api/articles?topic=cats')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(1)
				articles.forEach((article) => {
					expect(article.topic).toBe('cats')
				})
			})
	})
	test('GET - status 200 - returns an array with multiple queries operating at once', () => {
		return request(app)
			.get('/api/articles?sort_by=article_id&order=asc&topic=mitch')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(10) // After Limit Feature Applied - Total of 11.
				expect(articles).toBeSortedBy('article_id', {
					ascending: true,
				})
				articles.forEach((article) => {
					expect(article.topic).toBe('mitch')
				})
			})
	})
	test('GET - status 400 - Invalid Sort_by Criteria', () => {
		return request(app)
			.get('/api/articles?sort_by=nonsense')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid sort_by query')
			})
	})
	test('GET - status 400 - Invalid order criteria', () => {
		return request(app)
			.get('/api/articles?sort_by=article_id&order=nonsense')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid order query')
			})
	})
	test('GET - status 400 - Invalid query criteria but valid order criteria', () => {
		return request(app)
			.get('/api/articles?sort_by=nonsense&order=desc')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid sort_by query')
			})
	})
	test('GET - status 404 - not element with colour found', () => {
		return request(app)
			.get('/api/articles?topic=nonsense')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Article not found')
			})
	})
})
describe('GET /api/articles - Pagination', () => {
	test('GET - status 200 - returns an array with the pagination in default settings (a page of 10 items)', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(10)
			})
	})
	test('GET - status 200 - returns an array with the pagination in personalised settings (a page of 12 items)', () => {
		return request(app)
			.get('/api/articles?limit=12')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(12)
			})
	})
	test('GET - status 200 - returns maximun the element even if it smaller than the limit', () => {
		return request(app)
			.get('/api/articles?limit=50')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(12)
			})
	})
	test('GET - status 200 - returns an array with the pagination in default settings, second page', () => {
		return request(app)
			.get('/api/articles?p=2')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(2)
			})
	})
	test('GET - status 200 - returns an array with the pagination in personalised settings, third page', () => {
		return request(app)
			.get('/api/articles?limit=3&p=3')
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(3)
			})
	})
	test('GET - status 404 - returns an error if the user tries to navigate an empty page (excession of elements) ', () => {
		return request(app)
			.get('/api/articles?limit=6&p=3')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Article not found')
			})
	})
})
describe('POST /api/articles/', () => {
	test('POST - Status: 201 - responds with an object with required properties and sends back the posted article', () => {
		return request(app)
			.post('/api/articles/')
			.send({
				title: 'Test article is my passion',
				//TOPIC && AUTHOR are FOREIGN KEYS
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'This is a test article. My mere existence is reduced to a test',
				article_img_url:
					'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
			})
			.expect(201)
			.then(({ body: { article } }) => {
				//First version of testing objects
				expect(article).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						title: expect.any(String),
						body: expect.any(String),
						topic: expect.any(String),
						article_img_url: expect.any(String),
						article_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						//comment_count should be 0 as it is a brand new article, then this count won't stay in the table unless called it through previous "GET /api/articles"
						comment_count: expect.any(Number),
					})
				)
			})
	})
	test('POST - Status: 201 - responds with an object despite having unnecesarry properties', () => {
		return request(app)
			.post('/api/articles/')
			.send({
				title: 'Test article is my passion',
				//TOPIC && AUTHOR are FOREIGN KEYS
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'This is a test article. My mere existence is reduced to a test',
				nonsense: 10,
			})
			.expect(201)
			.then(({ body: { article } }) => {
				expect(article).toEqual(expect.not.objectContaining({ nonsense: 10 }))
			})
	})

	test('POST - Status: 404 - responds with an error if any part of the article is missing', () => {
		return request(app)
			.post('/api/articles/')
			.send({
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'This is a test article. My mere existence is reduced to a test',
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request: Missing part(s) of the request')
			})
	})
	test('POST - Status: 404 - responds with an error if user not found', () => {
		return request(app)
			.post('/api/articles/')
			.send({
				title: 'Test article is my passion',
				//TOPIC && AUTHOR are FOREIGN KEYS
				topic: 'coding',
				author: 'butter_bridge',
				body: 'This is a test article. My mere existence is reduced to a test',
			})
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe(
					'One of your parameters does not exist in our database'
				)
			})
	})
})

describe('GET - initial endpoint', () => {
	test('returns intructions for the initiation of the server', () => {
		return request(app)
			.get('/')
			.expect(200)
			.then(({ body }) => {
				expect(body.msg).toBe(
					'All OK. The server is up and running. To have access to a list of available endpoints, access "/api'
				)
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
