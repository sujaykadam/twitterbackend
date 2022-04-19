const setupDb = require('./db/db-setup');
const express = require('express');
const following = require('./db/models/following');
const tweetrouter = require('./routes/tweets.js')
const userrouter = require('./routes/user')
const cors = require('cors');
setupDb();

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/tweets', tweetrouter)
app.use('/user', userrouter)

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