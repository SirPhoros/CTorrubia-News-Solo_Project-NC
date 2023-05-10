const {
	selectArticleID,
	selectArticlesComment,
	selectArticles,
} = require('../models/articles.models')

exports.getArticleId = (req, res, next) => {
	const articleId = req.params.article_id
	selectArticleID(articleId)
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
	// console.log("in controller")
	selectArticles()
		.then((articles) => {
			res.status(200).send({ articles: articles })
		})
		.catch((err) => {
			next(err)
		})
}


