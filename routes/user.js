const express = require('express')
const user = require('../db/models/user');
const following = require('../db/models/following')
const userrouter = express.Router()
const jwt = require('jsonwebtoken');

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
    var result = {}
    try{
        var data = await user.query()
                            .select('user.fname', 'user.lname', 'user.picture', 'tweets', 'followers','following')
                            .withGraphJoined('[followers,following,tweets(ordertweet)]')
                            .where({'user.username': `${req.headers.profile}`});
        if (data.length == 0) res.status(404).send('User Not Found')
        else{
            result.fname = data[0].fname
            result.lname = data[0].lname
            result.followers = data[0].followers.length
            result.following = data[0].following.length
            result.picture = data[0].picture
            result.tweets = data[0].tweets
            result.ifollow = false
            data[0].followers.forEach(element => {
                if (element.username == req.headers.username) result.ifollow = true
            })
            res.send(result)
        }
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Error")
    }
})

userrouter.post('/registeruser', async(req, res) => {
    try{
        console.log(req.body)
        await user.query().insert(req.body)
        await following.query().insert({username: req.body.username, follows: req.body.username})
        res.status(200).send("User Registered")
    }catch(err){
        if(err.nativeError.code == 23505) res.send(err.nativeError.code)
        else res.send(500)
    }
})

userrouter.post('/modifyfollow', async(req, res) => {
    try{
        if (req.body.ifollow){
            await following.query().delete().where({username:req.body.username, follows:req.body.profile})
            var result = {action: false}
        }
        else{
            await following.query().insert({username:req.body.username, follows:req.body.profile})
            var result = {action: true}
        }
        res.send(result)
        
    }catch(err){
        console.log(err)
        res.status(503).send(err.nativeError.code)
    }
})

module.exports = userrouter