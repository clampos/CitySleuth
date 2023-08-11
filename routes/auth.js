// ----------------------------------------------------
// Import of required libraries
// ----------------------------------------------------
const express = require("express");
const router = express.Router();
const passport = require("passport");
const connection = require("../config/database");
const User = connection.models.User;
const VisitedPlace = connection.models.VisitedPlace;
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const joi = require("joi");
const registerValidation =
  require("../validations/validation").registerValidation;
const bcrypt = require("bcryptjs");
const flash = require("express-flash");
const methodOverride = require("method-override");
const axios = require("axios");
const https = require("https");

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

router.get("/contact", (req, res, next) => {
  res.render("contact");
});

// ----------------------------------------------------

router.get("/updateProfile", (req, res, next) => {
  res.render("updateProfile");
});

// ----------------------------------------------------

router.get("/dashboard", (req, res, next) => {
  res.render("dashboard", { username: req.user.username });
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
    return res.status(400).send({
      message:
        "An account with the same username already exists. Please go back and try again.",
    }); // Message to be tidied but works
  }

  const userExists_2 = await User.findOne({ email: req.body.email });
  if (userExists_2) {
    return res.status(400).send({
      message:
        "An account is already registered to this email address. Please go back and try again.", // Message to be tidied but works
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

router.post("/searchPlaces", async (req, res, next) => {
  const { latitude, longitude, keyword } = req.body;

  // Structure Google Places API call based on the received coordinates and keyword
  const googlePlacesAPIUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${latitude},${longitude}&radius=5000&query=${encodeURIComponent(
    keyword
  )}&key=AIzaSyAwvO4w6URyS1Rs15buwNKrF8xCPB9vJRA`;

  // Make API call to Google Places API using fetch
  fetch(googlePlacesAPIUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process the Google Places API response and send it back to the client
      res.json(data);
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch
      res.status(500).json({
        error: "500 error :(",
      });
    });
});

// ----------------------------------------------------

router.post("/markVisited", async (req, res, next) => {
  try {
    const placeName = req.body;
    const newPlace = await new VisitedPlace({
      placeName: req.body.placeName,
      userId: req.user._id,
    });

    newPlace
      .save()
      .then(
        User.updateOne(
          { _id: req.user._id },
          { $push: { visitedPlaces: newPlace.placeName } }
        )
      );
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------

module.exports = router;
