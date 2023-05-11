const db = require('../db/connection')
const format = require('pg')
const { checkArticleHasComments } = require('../db/seeds/utils')

exports.selectArticleID = (articleId) => {
	let queryStr = `
    SELECT * FROM articles
    WHERE article_id = $1;
    `
	return db.query(queryStr, [articleId]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: 'No article found with that ID',
			})
		}
		return result.rows
	})
}

exports.selectArticlesComment = (articleId) => {
	if (articleId === 'teapot')
		return Promise.reject({ status: 418, msg: "Hi, I'm just a tiny teapot!" })
	let queryStr = `
    SELECT comment_id, votes, created_at, author, body, article_id FROM comments
    WHERE article_id = $1
	ORDER BY created_at DESC
	`
	return checkArticleHasComments(articleId).then(() => {
		return db.query(queryStr, [articleId]).then((result) => {
			return result.rows
		})
	})
}
exports.selectArticles = (sort_by, order, topic) => {
	//I'm excluding "article_img_url" as there is no point of sorting it by images.
	const validSortQueries = [
		'article_id',
		'author',
		'title',
		'topic',
		'created_at',
		'body',
		'votes',
		'comment_count',
	]

	if (!validSortQueries.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Invalid sort_by query' })
	}
	if (!['asc', 'desc'].includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid order query' })
	}

	const queryValues = []
	let queryStr = `SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(*)::INT as comment_count
	FROM articles
	
	LEFT JOIN comments ON comments.article_id = articles.article_id `

	if (topic) {
		queryStr += ` WHERE topic = $1 `
		queryValues.push(topic)
	}

	queryStr += `GROUP BY articles.article_id
	ORDER BY ${sort_by} ${order};`

	// console.log(queryStr)
	// console.log(queryValues)

	return db.query(queryStr, queryValues).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Article not found' })
		}
		return result.rows
	})
}

exports.updateArticle = (newVote, articleID) => {
	if (newVote === undefined)
		return Promise.reject({
			status: 400,
			msg: 'Invalid category to be Updated',
		})
	if (typeof newVote !== 'number') {
		//personalised error, if not it'd end up naturally in 400 - "Bad request: Not valid type of input"
		return Promise.reject({ status: 400, msg: 'Introduce a whole number' })
	}
	return db
		.query(
			`UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING *;`,
			[newVote, articleID]
		)
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found' })
			}
			return result.rows[0]
		})
}
exports.addCommentByArticleID = (articleComment, articleID) => {
	const { username, body } = articleComment
	if (!body) {
		return Promise.reject({
			status: 400,
			msg: 'Bad request: The body of the comment is required',
		})
	}
	if (!username) {
		return Promise.reject({
			status: 400,
			msg: 'Bad request: An username to attribute this comment is required',
		})
	}

	const queryParams = [username, body, articleID]
	let queryStr = `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`

	return db.query(queryStr, queryParams).then((result) => {
		if (result.rows.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'No article found with that ID',
			})
		return result.rows[0]
	})
	// console.log(
	// )
	// return db
	// 	.query(queryStr, [articleComment.username, articleComment.body, articleID])
	// 	.then((result) => {
	// 		console.log(result)
	// 		// if (result.rows.length === 0) {
	// 		// 	return Promise.reject({ status: 404, msg: 'Article not found' })
	// 		// }
	// 		return result.rows[0]
	// 	})
}
