const db = require('../db/connection')
const format = require('pg')
const fs = require('fs/promises') // require('fs').promises also valid. 


exports.fetchApi = () => {
	return fs.readFile('endpoints.json', 'utf8', (err, data) => {
		if (err) throw err
	})
}
