// Libraries installed using npm
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const routes = require("./routes/auth");
const connection = require("./config/database");

const MongoStore = require("connect-mongo")(session);

require("dotenv/config");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Middlewares

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Print request path and request method after every call, and pass on to next handler
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Import routes from auth.js

app.use(routes);

// Listen for requests on port 3000
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
