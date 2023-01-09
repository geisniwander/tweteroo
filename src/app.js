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
    new URL(avatar);
    isURL = true;
  } catch (err) {
    isURL = false;
  }
  if (!username || typeof username !== "string") return res.sendStatus(400);
  if (!avatar || !isURL) return res.sendStatus(400);
  users.push(userObj);
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const username = req.headers.user;
  const tweet = req.body.tweet;
  const tweetObj = { username, tweet };
  const isRegistered = users.find((user) => user.username === username);
  if (username === "" || tweet === "")
    return res.status(400).send("Todos os campos são obrigatórios!");
  if (!tweet || typeof tweet !== "string") return res.sendStatus(400);
  if (!isRegistered) return res.status(401).send("UNAUTHORIZED");
  tweets.push(tweetObj);
  res.status(201).send(tweetObj);
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;
  if (page && page !== "") {
    const numPage = Number(page);
    if (!numPage || numPage <= 0)
      return res.status(400).send("Informe uma página válida!");
    if (numPage) {
      const initialTweet = numPage * 10 - 10;
      const finalTweet = initialTweet + 10;
      const tweetPage = [...tweets].reverse().slice(initialTweet, finalTweet);
      tweetPage.map((l) => {
        l.avatar = users.find((user) => user.username === l.username).avatar;
      });
      if (tweetPage.length === 0)
        return res.status(404).send("Informe uma página válida!");
      return res.send(tweetPage);
    }
  } else {
    const last10 = [...tweets].reverse().slice(0, 10);
    last10.map((l) => {
      l.avatar = users.find((user) => user.username === l.username).avatar;
    });
    res.status(200).send(last10);
  }
});

app.get("/tweets/:USERNAME", (req, res) => {
  const paramName = req.params.USERNAME;
  const userTweets = [...tweets].filter((t) => t.username === paramName);
  userTweets.map((l) => {
    l.avatar = users.find((user) => user.username === l.username).avatar;
  });
  res.status(200).send(userTweets);
});

app.listen(5000);
