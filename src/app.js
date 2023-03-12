const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
