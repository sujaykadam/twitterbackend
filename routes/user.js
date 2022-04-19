const express = require('express')
const user = require('../db/models/user');
const following = require('../db/models/following')
const tweets = require('../db/models/tweets')
const userrouter = express.Router()
const jwt = require('jsonwebtoken');
const { response } = require('express');

userrouter.post('/authuser', async (req, res) => {
    var result = await user.query().select('*').where('username','=',req.body.username)
    if (result.length > 0){
    hashpass = (result[0].password)
    if (hashpass === req.body.password){
        result[0]['isAuth'] = true
        token = jwt.sign(JSON.stringify(result[0]),'secretkey')
        try{decoded = jwt.verify(token, 'secretkey')}
        catch (err){
            console.log(err.message)
        }
        result[0].token = token
        res.json(result[0]);
    }
}
    else
        res.json({isAuth: false});
})

userrouter.get('/profile', async(req, res) => {
    var response = {}
    var result = {}
    try{
        result = await user.query().select('username','fname','lname').where('username','=',req.headers.profile)
        if (result.length == 0)
            res.status(404).send('User Not Found')
        else {
            response.username = result[0].username
            response.fname = result[0].fname
            response.lname = result[0].lname
        }
        result.followers = await following.query().select('*').where('follows','=',req.headers.profile)
        result.ifollow = false
        result.followers.forEach(ele => {
            if (ele.username == req.headers.username){
                result.ifollow = true
            }
        })
        result.followers = result.followers.length
        result.following = await following.query().select('*').where('username','=',req.headers.profile)
        result.following = result.following.length
        
        result.tweets = await tweets.query()
        .select('user.fname', 'user.lname', 'user.username', 'user.picture', 'tweets.tweet','tweets.id')
        .join('user', 'user.username', 'tweets.username').where('user.username',req.headers.profile).orderBy('tweets.updated_at','desc')

        response.followers = result.followers
        response.following = result.following
        response.tweets = result.tweets
        response.ifollow = result.ifollow

        res.send(response)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Error")
    }
})

userrouter.post('/registeruser', async(req, res) => {
    try{
        var result = await user.query().insert(req.body)
        res.status(200).send("User Registered")
    }catch(err){
        if(err.nativeError.code == 23505) res.send(err.nativeError.code)
        else res.send(500)
    }
})

module.exports = userrouter