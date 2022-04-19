const express = require('express')
const tweets = require('../db/models/tweets');
const following = require('../db/models/following')
const user = require('../db/models/user')

const tweetrouter = express.Router()
const { raw } = require('objection');

tweetrouter.post('/tweet', async (req, res) => {
    try {
        const newtweet = await tweets.query().insert({ username: req.body.username, tweet: req.body.tweet })
    } catch (err) {
        console.log(err)
        res.sendStatus(500).send(err)
    }
    res.sendStatus(200)
})

tweetrouter.get('/tweets', async (req, res) => {
    try {
        var tweetslis = await user.query()
            .select('user.fname', 'user.lname', 'user.username', 'user.picture', 'tweets.tweet', 'tweets.id')
            .joinRelated('tweets')
            .whereIn('user.username',
                following.query().select('following.follows').where({ username: `${req.headers.username}` }))
            .orWhere({'user.username': `${req.headers.username}`})
            .orderBy('tweets.updated_at', 'desc')
    } catch (err) {
        console.log(err.message)
        res.send(err)
    }
    res.send(JSON.stringify(tweetslis))
})

module.exports = tweetrouter