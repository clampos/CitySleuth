// Libraries installed using npm
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes/auth");
const connection = require("./config/database");

const mongoStore = require("connect-mongo")(session);

require("./config/passport");

require("dotenv/config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(passport.initialize());
app.use(passport.session);

// Print request path and request method after every call, and pass on to next handler
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Import routes from auth.js

app.use(routes);

mongoose.connect(process.env.DB_CONNECTOR, () => {
  console.log("Successfully connected to the database...");
});

// Listen for requests on port 3000
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
