const db = require('../db/connection')
const format = require('pg')

exports.removeComment = (commentID) => {
	let queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
	return db.query(queryStr, [commentID]).then((deletedItem) => {
		if (deletedItem.rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: 'No article found with that ID',
			})
		}
		return deletedItem.rows[0]
	})
}

exports.updateComment = (newVote, id) => {
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
			`UPDATE comments SET votes = votes + $1 WHERE comment_id =$2 RETURNING *;`,
			[newVote, id]
		)
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Comment not found' })
			}
			return result.rows[0]
		})
}
