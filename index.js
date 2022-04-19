const setupDb = require('./db/db-setup');
const express = require('express');
const following = require('./db/models/following');
const user = require('./db/models/user');
const tweetrouter = require('./routes/tweets.js')
const userrouter = require('./routes/user')
const cors = require('cors');
const tweets = require('./db/models/tweets');
setupDb();

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/tweets', tweetrouter)
app.use('/user', userrouter)

app.listen(9231, () => console.log('server is running on port 9231'));