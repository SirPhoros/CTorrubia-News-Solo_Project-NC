const { selectUsers, selectUsername } = require('../models/users.models')

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => {
			res.status(200).send({ users: users })
		})
		.catch((err) => {
			next(err)
		})
}

exports.getUsername = (req, res, next) => {
	const username = req.params.username
	selectUsername(username)
		.then((user) => {
			res.status(200).send({ user: user })
		})
		.catch((err) => {
			next(err)
		})
}
