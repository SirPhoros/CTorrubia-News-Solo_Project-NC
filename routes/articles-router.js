const {
	getArticle,
	postArticle,
	getArticleId,
	patchArticle,
	getArticlesComment,
	postCommentByArticleID,
} = require('../controllers/articles.controller')

const articleRouter = require('express').Router()

articleRouter.route('/').get(getArticle).post(postArticle)

articleRouter.route('/:article_id').get(getArticleId).patch(patchArticle)

articleRouter
	.route('/:article_id/comments')
	.get(getArticlesComment)
	.post(postCommentByArticleID)

module.exports = articleRouter
