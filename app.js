const express = require('express')
const { getArticleId } = require('./controllers/articles.controllers')
const app = express()

app.use(express.json())

module.exports = app

app.get('/api/articles/:article_id', getArticleId)

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg })
	} else {
		next(err)
	}
})
app.use((err, req, res, next) => {
	// console.log(err)
	res.status(500).send({ msg: "Server error! We're very sorry" })
})
