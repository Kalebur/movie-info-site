const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv").config();
const api = require("./api.js");

app.use(express.static(path.join(__dirname, "../assets/")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/upcoming", (req, res) => {
  api.getUpcomingMovies().then((data) => res.send(data));
});

app.listen(3000, () => {
  api.initializeGenres();
  console.log("App running on port 3000");
});
