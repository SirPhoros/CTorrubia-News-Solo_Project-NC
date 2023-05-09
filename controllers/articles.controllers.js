const { selectArticleID } = require('../models/articles.models')

exports.getArticleId = (req, res, next) => {
	const articleId = req.params.article_id
	selectArticleID(articleId)
		.then((article) => {
			res.status(200).send({ articles: article })
		})
		.catch((err) => {
			next(err)
		})
}
