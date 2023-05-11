const db = require('../connection')

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties }
	return { created_at: new Date(created_at), ...otherProperties }
}

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value]
		return ref
	}, {})
}

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to]
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		}
	})
}

// exports.checkUsernameExists = (username) => {
// 	return db
// 		.query('SELECT * FROM users WHERE username = $1', [username])
// 		.then((result) => {
// 			if (result.rows.length === 0 && username) {
// 				return Promise.reject({ status: 404, msg: 'User not found' })
// 			}
// 		})
// }

// exports.checkArticleExists = (articleID) => {
// 	return db
// 		.query('SELECT * FROM articles WHERE article_id = $1', [articleID])
// 		.then((result) => {
// 			if (result.rows.length === 0 && articleID) {
// 				return Promise.reject({ status: 404, msg: 'Invalid ID' })
// 			}
// 		})
// }
exports.checkArticleHasComments = (articleID) => {
	// If there is an articleID
	return db
		.query('SELECT * FROM articles WHERE article_id = $1', [articleID])
		.then((result) => {
			if (result.rows.length === 0 && articleID) {
				return Promise.reject({
					status: 404,
					msg: 'No article found with that ID',
				})
			}
			//Otherwise, let the function do its chores
		})
}
