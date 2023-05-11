const { removeComment } = require('../models/comments.models')

exports.deleteComment = (req, res, next) => {
	const commentID = req.params.comment_id
	removeComment(commentID)
		.then((deletedItem) => {
			res.status(204).send()
		})
		.catch((err) => {
			// console.log(err)
			next(err)
		})
}
