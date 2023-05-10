const { getAPI } = require('./controllers/api.controller')
const { getArticleId, getArticle, postCommentByArticleID } = require('./controllers/articles.controller')
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

//COMMENTS
app.post('/api/articles/:article_id/comments', postCommentByArticleID)

//ERROR HANDLING
app.all('*', (req, res) => {
	res.status(404).send({ msg: 'endpoint not found' })
})
////PSQL errors
app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request: Not valid type of input' })
	} else {
		next(err)
	}
})

app.use((err, req, res, next) => {
	if (err.code === '23503') {
		res.status(404).send({ msg: 'User not found' })
	} else {
		next(err)
	}
})
////Personalised Error
app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg })
	} else {
		next(err)
	}
})
//////Last-Error Resource
app.use((err, req, res, next) => {
	// console.log(err)
	res.status(500).send({ msg: "server error! We're very sorry" })
})

module.exports = app
