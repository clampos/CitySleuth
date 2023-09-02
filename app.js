// ----------------------------------------------------
// Import of required libraries
// ----------------------------------------------------

const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes/routes");
const connection = require("./config/database");
const flash = require("express-flash");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")(session);
require("dotenv/config");
const path = require("path");

// ----------------------------------------------------

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// ----------------------------------------------------

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ----------------------------------------------------

// Middlewares

require("./config/passport");

app.use(passport.initialize());
app.use(flash());
app.use(methodOverride("_method"));
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

module.exports = app;
