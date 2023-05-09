const { fetchApi } = require('../models/api.models')

exports.getAPI = (req, res, next) => {
	fetchApi()
		.then((endpoints) => {
			res.status(200).send({ endpoints: endpoints })
		})
		.catch((err) => {
			console.log(err)
			next(err)
		})
}