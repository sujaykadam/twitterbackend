const express = require('express')
const tweets = require('../db/models/tweets');
const following = require('../db/models/following')
const tweetrouter = express.Router()
const { raw } = require('objection');

tweetrouter.post('/puttweet', async (req, res) => {
    try {
        const newtweet = await tweets.query().insert({ username: req.body.username, tweet: req.body.tweet })
        console.log(newtweet)
    } catch (err) {
        console.log(err)
        res.sendStatus(500).send(err)
    }
    res.sendStatus(200)
})

tweetrouter.post('/gettweets', async (req, res) => {
    try {
        /*var tweetslis = await tweets.query()
            .select('user.fname', 'user.lname', 'user.username', 'user.picture', 'tweets.tweet','tweets.id')
            .join('user', 'user.username', 'tweets.username').orderBy('tweets.updated_at','desc')*/
        
        var followinglis = await following.query()
                            .select('following.follows')
                            .where('following.username','=',`${req.body.username}`)
        followinglis = followinglis.map(ele => ele.follows)
        var tweetslis = await tweets.query()
                        .select('user.fname', 'user.lname', 'user.username', 'user.picture', 'tweets.tweet','tweets.id')
                        .join('user', 'user.username', 'tweets.username')
                        .where('user.username','=', `${req.body.username}`)
                        .orWhereIn('user.username',followinglis)
                        .orderBy('tweets.updated_at','desc')
    } catch (err) {
        console.log(err.message)
        res.send(err)
    }
    res.json(tweetslis)
})

module.exports = tweetrouter