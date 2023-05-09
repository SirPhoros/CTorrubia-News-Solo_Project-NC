const { fetchApi } = require('../models/api.models')
const endpoints = require('../endpoints.json')

exports.getAPI = (req, res, next) => {
	res.status(200).send(endpoints)
}
