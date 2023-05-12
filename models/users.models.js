const db = require('../db/connection')

exports.selectUsers = () => {
	let queryStr = `
    SELECT * FROM users
    `
	return db.query(queryStr).then((result) => {
		return result.rows
	})
}

exports.selectUsername = (username) => {
	let queryStr = `
    SELECT * FROM users
    WHERE username = $1;
    `
	return db.query(queryStr, [username]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: 'No user found with that username',
			})
		}
		return result.rows
	})
}
