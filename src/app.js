const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv").config();
const api = require("./api.js");
const open = require("open");
const helpers = require("./helpers.js");

async function openBrowser() {
  await open("http://localhost:3000");
}

const whitelist = [
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
];

app.use(express.static(path.join(__dirname, "../assets/")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/upcoming", (req, res) => {
  api.getUpcomingMovies().then((data) => res.send(data));
});

app.get("/now-playing", (req, res) => {
  api.getNowPlaying().then((data) => res.send(data));
});

app.get("/trending-movies", (req, res) => {
  api.getTrending().then((data) => res.send(data));
});

app.get("/trending-tv", (req, res) => {
  api.getTrending("tv").then((data) => res.send(data));
});

app.get("/all-genres", (req, res) => {
  if (!whitelist.includes(req.hostname)) {
    res.redirect("/404");
  } else {
    res.send(api.genreList());
  }
});

app.get("/cast/:media_id", (req, res) => {
  res.send(req.params.media_id);
});

app.get("/recommended/:media_query", (req, res) => {
  let queryParams = helpers.splitParams(req.params.media_query);

  api
    .getRecommendations(queryParams[0], queryParams[1])
    .then((data) => res.send(data));
});

app.get("/streaming-info/:media_query", (req, res) => {
  let queryParams = helpers.splitParams(req.params.media_query);

  api
    .getStreamingProviders(queryParams[0], queryParams[1])
    .then((data) => res.status(200).json(data));
});

app.get("/search/:query", (req, res) => {
  api.getSearchResults(req.params.query).then((data) => res.send(data));
});

app.get("/similar/:media_query", (req, res) => {
  let queryParams = helpers.splitParams(req.params.media_query);

  res.status(404).send(`Can't find that, sorry!`);
});

app.get("/details/:media_query", (req, res) => {
  let queryParams = helpers.splitParams(req.params.media_query);

  res.status(200).send("OK!");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000, () => {
  api.initializeGenres();
  console.log("App running on port 3000");
  // openBrowser();
});
