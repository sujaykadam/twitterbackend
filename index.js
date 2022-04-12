const setupDb = require('./db/db-setup');
const express = require('express');
const user = require('./db/models/user');
const cors = require('cors');

setupDb();

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.get('/authuser/', async (req, res) => {
    result = await user.query()
    .select('password')
    .where('username','=',req.body.username)
    hashpass = (result[0].password)
    if (hashpass === req.body.password)
        res.json({isAuth: true});
    else
        res.json({isAuth: false});
})

app.listen(9231, () => console.log('server is running on port 9231'));