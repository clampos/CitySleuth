const express = require("express");
// express app
const app = express();

// const https = require('https')

// const fs = require('fs')

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

require("dotenv/config");

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req, res) => {
  res.render("start");
});

// Routes set
const authRoute = require("./routes/auth");

// Middleware
app.use("/api/user", authRoute);

mongoose.connect(process.env.DB_CONNECTOR, () => {
  console.log("Successfully connected to the database...");
});

// Listen for requests
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
