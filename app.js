const { getAPI } = require('./controllers/api.controller')
const { getArticleId, getArticle } = require('./controllers/articles.controller')
const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')
const app = express()

app.use(express.json())

//TOPICS
app.get('/api/topics', getTopics)

//API
app.get('/api', getAPI)

//ARTICLES
app.get('/api/articles/:article_id', getArticleId)
app.get('/api/articles/', getArticle)

//ERROR HANDLING
app.all('*', (req, res) => {
	res.status(404).send({ msg: 'endpoint not found' })
})

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request: Not valid type of input' })
	} else {
		next(err)
	}
})

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg })
	} else {
		next(err)
	}
})

app.use((err, req, res, next) => {
	// console.log(err)
	res.status(500).send({ msg: "server error! We're very sorry" })
})

module.exports = app
