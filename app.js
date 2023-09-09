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
// Setting view engine to EJS and configuration of views and public folders to make them accessible to application
// ----------------------------------------------------

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------------------------------
// Setting up application to parse incoming requests
// ----------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// Configuring MongoDB session store for user sessions, including options
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
// Initialising Passport for incoming requests
// ----------------------------------------------------

require("./config/passport");

app.use(passport.initialize());

// ----------------------------------------------------
// Further middlewares, including method override for PUT and DELETE requests, and restoring login state from a session
// ----------------------------------------------------

app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.session());

// ----------------------------------------------------
// Logging session and user to the console for each request; logging path and method for each request
// ----------------------------------------------------

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// ----------------------------------------------------
// Import routes from routes.js
// ----------------------------------------------------

app.use(routes);

// ----------------------------------------------------
// Listen for requests on port number taken from .env
// ----------------------------------------------------
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

module.exports = app;
