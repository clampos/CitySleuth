// ----------------------------------------------------
// Import of required libraries
// ----------------------------------------------------
const express = require("express");
const router = express.Router();
const passport = require("passport");
const connection = require("../config/database");
const User = connection.models.User;
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const joi = require("joi");
const registerValidation =
  require("../validations/validation").registerValidation;
const bcrypt = require("bcryptjs");
const flash = require("express-flash");
const methodOverride = require("method-override");

// ----------------------------------------------------
// GET routes
// ----------------------------------------------------

router.get("/", (req, res, next) => {
  res.render("register");
});

// ----------------------------------------------------

router.get("/home", (req, res, next) => {
  res.render("homepage", { username: req.user.username });
});

// ----------------------------------------------------

router.get("/register", (req, res, next) => {
  res.render("register");
});

// ----------------------------------------------------

router.get("/login", (req, res, next) => {
  res.render("login");
});

// ----------------------------------------------------

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// ----------------------------------------------------

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

// ----------------------------------------------------
// POST routes
// ----------------------------------------------------

router.post("/register", async (req, res, next) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] }); // Message to be tidied but works
  }

  const userExists_1 = await User.findOne({ username: req.body.username });
  if (userExists_1) {
    return res
      .status(400)
      .send({ message: "An account with the same username already exists" }); // Message to be tidied but works
  }

  const userExists_2 = await User.findOne({ email: req.body.email });
  if (userExists_2) {
    return res.status(400).send({
      message: "An account is already registered to this email address", // Message to be tidied but works
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    user.save().then((user) => {
      console.log(user);
    });

    res.redirect("./login");
  } catch {
    res.redirect("./register");
  }
});

// ----------------------------------------------------

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home",
    failureFlash: true,
  })
);

// ----------------------------------------------------

module.exports = router;
