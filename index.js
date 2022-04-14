const setupDb = require('./db/db-setup');
const express = require('express');
const user = require('./db/models/user');
const followers = require('./db/models/followers');
const following = require('./db/models/following');
const tweetrouter = require('./routes/tweets.js')
const cors = require('cors');
const jwt = require('jsonwebtoken')
setupDb();

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/tweets', tweetrouter)

app.post('/authuser', async (req, res) => {
    var result = await user.query().select('*').where('username','=',req.body.username)
    
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
    else
        res.json({isAuth: false});
})

app.post('/getuser', async(req, res) => {
    console.log(req.body.username)
    try{var result = await user.query().select('username','fname','lname').where('username','=',req.body.username)
    if (result.length == 0)
        res.status(404).send('User Not Found')
    else
    console.log(result[0])
        res.send(result[0])
    } catch{
        res.status(503).send("Internal Error")
    }
})

app.listen(9231, () => console.log('server is running on port 9231'));