const setupDb = require('./db/db-setup');
const express = require('express');
const user = require('./db/models/user');
const followers = require('./db/models/followers');
const following = require('./db/models/following');
const tweetrouter = require('./routes/tweets.js')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const tweets = require('./db/models/tweets');
setupDb();

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/tweets', tweetrouter)

app.post('/authuser', async (req, res) => {
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

app.post('/getuser', async(req, res) => {
    try{var result = await user.query().select('username','fname','lname').where('username','=',req.body.username)
    if (result.length == 0)
        res.status(404).send('User Not Found')
    else {
        res.send(result[0])
    }
    } catch{
        res.status(503).send("Internal Error")
    }
})

app.post('/registeruser', async(req, res) => {
    try{
        var result = await user.query().insert(req.body)
        res.status(200).send("User Registered")
    }catch(err){
        console.log(err.nativeError.code)
        res.status(503).send(err.nativeError.code)
    }
})

app.post('/getprofiledata', async(req, res) => {
    try{
        var result = {}
        result.followers = await following.query().select('*').where('follows','=',req.body.profile)
        result.ifollow = false
        result.followers.forEach(ele => {
            if (ele.username == req.body.username){
                result.ifollow = true
            }
        })
        result.followers = result.followers.length
        result.following = await following.query().select('*').where('username','=',req.body.profile)
        result.following = result.following.length
        
        result.tweets = await tweets.query()
        .select('user.fname', 'user.lname', 'user.username', 'user.picture', 'tweets.tweet','tweets.id')
        .join('user', 'user.username', 'tweets.username').where('user.username',req.body.profile).orderBy('tweets.updated_at','desc')
        res.send(result)
    }catch(err){
        console.log(err)
        res.status(503).send(err.message)
    }
})

app.post('/modifyfollow', async(req, res) => {
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

app.listen(9231, () => console.log('server is running on port 9231'));