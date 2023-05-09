const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')
const app = express()

//TOPICS
app.get('/api/topics', getTopics)

//ERROR HANDLING
app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg })
	} else {
		next(err)
	}
})

app.use((err, req, res, next) => {
	res.status(404).send({ msg: 'endpoint not found' })

	next(err)
})

app.use((err, req, res, next) => {
	console.log(err)
	res.status(500).send({ msg: "server error! We're very sorry" })
})

module.exports = app
