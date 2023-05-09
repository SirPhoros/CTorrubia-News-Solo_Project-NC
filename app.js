const { getAPI } = require('./controllers/api.controller')
const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')
const app = express()

app.use(express.json())

//TOPICS
app.get('/api/topics', getTopics)

//API
app.get('/api', getAPI)

//ERROR HANDLING
app.all('*', (req, res) => {
	res.status(404).send({ msg: 'endpoint not found' })
})

app.use((err, req, res, next) => {
	// console.log(err)
	res.status(500).send({ msg: "server error! We're very sorry" })
})

module.exports = app
