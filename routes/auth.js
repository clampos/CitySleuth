// ----------------------------------------------------
// Installation of required libraries
// ----------------------------------------------------
const express = require("express");
const router = express.Router();
const passport = require("passport");
const genPassword = require("../utils/passwordUtil").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const isAuth = require("./authMiddle").isAuth;
const isAdmin = require("./authMiddle").isAdmin;
require("joi");
const registerValidation =
  require("../validations/validation").registerValidation;
const loginValidation = require("../validations/validation").loginValidation;

// ----------------------------------------------------
// GET routes
// ----------------------------------------------------

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/home", (req, res, next) => {
  res.render("homepage");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send(
    "<p>You made it to the protected route. Please <a href='/logout'>logout</a></p>"
  );
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

// ----------------------------------------------------
// POST routes
// ----------------------------------------------------

router.post("/register", async (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    hash: hash,
    salt: salt,
  });

  user.save().then((user) => {
    console.log(user);
  });

  res.redirect("./login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home",
  })
);

module.exports = router;
