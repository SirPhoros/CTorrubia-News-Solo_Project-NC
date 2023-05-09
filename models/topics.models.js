const db = require('../db/connection')
const format = require('pg')

exports.fetchTopics = () => {
	let queryStr = `
    SELECT * FROM topics
    `
	return db.query(queryStr).then((result) => {
		return result.rows
	})
}
