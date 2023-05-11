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
