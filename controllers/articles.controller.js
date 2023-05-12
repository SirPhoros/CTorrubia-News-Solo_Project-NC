const {
	selectArticleID,
	selectArticles,
	updateArticle,
	addCommentByArticleID,
	selectArticlesComment,
	addArticle,
} = require('../models/articles.models')

exports.getArticleId = (req, res, next) => {
	const articleId = req.params.article_id
	const { count } = req.query
	selectArticleID(articleId, count)
		.then((article) => {
			res.status(200).send({ article: article })
		})
		.catch((err) => {
			next(err)
		})
}

exports.getArticlesComment = (req, res, next) => {
	const articleId = req.params.article_id
	selectArticlesComment(articleId)
		.then((comment) => {
			res.status(200).send({ comments: comment })
		})
		.catch((err) => {
			next(err)
		})
}
exports.getArticle = (req, res, next) => {
	let { sort_by = 'created_at', order = 'desc', topic } = req.query
	selectArticles(sort_by, order, topic)
		.then((articles) => {
			res.status(200).send({ articles: articles })
		})
		.catch((err) => {
			next(err)
		})
}

exports.patchArticle = (req, res, next) => {
	const articleID = req.params.article_id
	const newVote = req.body.inc_votes
	updateArticle(newVote, articleID)
		.then((updatedArticle) => {
			res.status(202).send({ article: updatedArticle })
		})
		.catch((err) => {
			next(err)
		})
}
exports.postCommentByArticleID = (req, res, next) => {
	const articleID = req.params.article_id
	const articleComment = req.body
	addCommentByArticleID(articleComment, articleID)
		.then((comment) => {
			res.status(201).send({ comment: comment })
		})
		.catch((err) => {
			// console.log(err)
			next(err)
		})
}

exports.postArticle = (req, res, next) => {
	const newArticle = req.body
	addArticle(newArticle)
		.then((article) => {
			res.status(201).send({ article: article })
		})
		.catch((err) => {
			next(err)
		})
}
