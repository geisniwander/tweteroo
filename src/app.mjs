import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());

const tweets = [];
const users = [];

app.post("/sign-up", (req, res) => {
    const user = req.body;
    users.push(user);
    res.send(user);
})

app.post("/tweets", (req, res) => {
    const tweet = req.body;
    tweets.push(tweet);
    res.send(tweet);
})

app.get("/tweets", (req, res) => {
    res.send(tweets);
})


app.listen(5020);