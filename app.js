// Libraries installed using npm
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Routes set
const authRoute = require("./routes/auth");

// Middleware
app.use("/", authRoute);

mongoose.connect(process.env.DB_CONNECTOR, () => {
  console.log("Successfully connected to the database...");
});

// Listen for requests
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
