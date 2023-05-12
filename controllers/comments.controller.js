const { removeComment, updateComment } = require('../models/comments.models')

exports.deleteComment = (req, res, next) => {
	const commentID = req.params.comment_id
	removeComment(commentID)
		.then(() => {
			res.status(204).send()
		})
		.catch((err) => {
			// console.log(err)
			next(err)
		})
}

exports.patchComment = (req, res, next) => {
	const id = req.params.comment_id
	const newVote = req.body.inc_votes
	updateComment(newVote, id)
		.then((updatedComment) => {
			res.status(202).send({ comment: updatedComment })
		})
		.catch((err) => {
			next(err)
		})
}
