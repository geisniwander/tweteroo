import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const tweets = [];
const users = [];

app.post("/sign-up", (req, res) => {
  const user = req.body;
  users.push(user);
  res.send("OK");
});

app.post("/tweets", (req, res) => {
  const content = req.body;
  const name = req.body.username;
  const tweet = req.body.tweet;
  const isRegistered = users.find((user) => user.username === name);
  if (!isRegistered) return res.status(401).send("UNAUTHORIZED");
  tweets.push(content);
  res.send(tweet);
});

app.get("/tweets", (req, res) => {
  const last10 = tweets.reverse().slice(0, 10);
  last10.map((l) => {
    l.avatar = users.find((user) => user.username === l.username).avatar;
  });
  res.send(last10);
});

app.listen(5000);