const { fetchApi } = require('../models/app.models')

exports.getAPI = (req, res, next) => {
	fetchApi()
		.then((endpoints) => {
			// console.log(endpoints, "endpoints")
			res.status(200).send({ endpoints: endpoints })
		})
		.catch((err) => {
			console.log(err)
			next(err)
		})
}
