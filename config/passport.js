require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const connection = require("./database");
const { valid } = require("joi");
const { request } = require("express");
const User = connection.models.User;
require("dotenv/config");
const verifyUser = (username, password, done) => {
  User.findOne({ username: username }).then(async (user) => {
    if (user == null) {
      return done(null, false, { message: "No user with this username" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  });
};

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    verifyUser
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
