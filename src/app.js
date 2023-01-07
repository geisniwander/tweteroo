import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const tweets = [];
const users = [];

app.post("/sign-up", (req, res) => {
  const userObj = req.body;
  const username = userObj.username;
  const avatar = userObj.avatar;
  let isURL = false;
  if (username === "" || avatar === "")
    return res.status(400).send("Todos os campos são obrigatórios!");
  try {
    let url = new URL(avatar);
    isURL = true;
  } catch (err) {
    isURL = false;
  }
  if (!username || typeof username !== "string") 
    return res.sendStatus(400);
  if (!avatar || !isURL) 
    return res.sendStatus(400);
  users.push(userObj);
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const tweetObj = req.body;
  const username = tweetObj.username;
  const tweet = tweetObj.tweet;
  const isRegistered = users.find((user) => user.username === username);
  if (username === "" || tweet === "")
    return res.status(400).send("Todos os campos são obrigatórios!");
  if (!tweet || typeof tweet !== "string") 
    return res.sendStatus(400);
  if (!isRegistered) 
    return res.status(401).send("UNAUTHORIZED");
  tweets.push(tweetObj);
  res.status(201).send(tweetObj);
});

app.get("/tweets", (req, res) => {
  const {USERNAME} = req.query;
  if(!USERNAME){
    const last10 = tweets.reverse().slice(0, 10);
    last10.map((l) => {
      l.avatar = users.find((user) => user.username === l.username).avatar;
    });
    res.send(last10);
  }else{
    const userTweets = tweets.filter(t => t.username===USERNAME);
    res.send(userTweets)
  }

});

app.listen(5000);
