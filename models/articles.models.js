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
exports.selectArticles = () => {
	// console.log("in model")
	let queryStr = `
	SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(*)::INT as comment_count
	FROM articles
	JOIN comments ON comments.article_id = articles.article_id
	GROUP BY articles.article_id
	ORDER BY articles.created_at DESC
	`
	return db.query(queryStr).then((result) => {
		return result.rows
	})
}

