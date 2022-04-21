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
        var response = []
        var result = await user.query()
            .select('following')
            .withGraphJoined('following.tweets(ordertweet).user(tweetdata)')
            .where({'user.username': `${req.headers.username}`})

        result[0].following.forEach(element => {
            element.tweets.forEach(ele => {
                response.push({
                    id: ele.id,
                    fname: ele.user.fname,
                    lname: ele.user.lname,
                    username: ele.user.username,
                    picture: ele.user.picture,
                    tweet: ele.tweet
                })
            })
        });
        response.sort((a,b) => {
            return b.id - a.id
        })
        res.send(response)
    } catch (err) {
        console.log(err.message)
        res.send(err)
    }
})

module.exports = tweetrouter