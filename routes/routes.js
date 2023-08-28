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
const verifyToken = require("../utils/verifyToken");
const setToken = require("../utils/setToken");
const authorise = require("../utils/verifyToken");

// ----------------------------------------------------
// GET routes
// ----------------------------------------------------

router.get("/", async (req, res, next) => {
  res.render("register");
});

// ----------------------------------------------------

router.get("/home", async (req, res, next) => {
  res.render("homepage", { username: req.user.username });
});

// ----------------------------------------------------

router.get("/register", async (req, res, next) => {
  res.render("register");
});

// ----------------------------------------------------

router.get("/login", async (req, res, next) => {
  res.render("login");
});

// ----------------------------------------------------

router.get("/logout", async (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
});
// ----------------------------------------------------

router.get("/contact", async (req, res, next) => {
  res.render("contact");
});

// ----------------------------------------------------

router.get("/my-account", async (req, res, next) => {
  res.render("myAccount");
});

// ----------------------------------------------------

router.get("/dashboard", async (req, res, next) => {
  User.findOne({ _id: req.user._id }, function (err, user) {
    res.render("dashboard", { username: req.user.username, user: user });
  });
});

// ----------------------------------------------------

router.get("/login-failure", async (req, res, next) => {
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

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

// ----------------------------------------------------

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home",
    failureFlash: true,
  }),
  setToken
);

// ----------------------------------------------------

router.post("/place-search", async (req, res, next) => {
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

router.post("/marked-visited", async (req, res, next) => {
  const newPlace = new VisitedPlace({
    placeId: req.body.placeId,
    placeName: req.body.placeName,
    placeAddress: req.body.placeAddress,
    userId: req.user._id,
  });

  await newPlace.save();

  try {
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          visitedPlaces: {
            placeId: req.body.placeId,
            placeName: req.body.placeName,
            placeAddress: req.body.placeAddress,
          },
        },
      },
      { new: true }
    ).then((user) => {
      console.log(user);
    });
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------
// PATCH routes
// ----------------------------------------------------

router.patch("/preference-save/:preference", async (req, res, next) => {
  const preference = req.params.preference;

  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          preferences: preference,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------
// DELETE routes
// ----------------------------------------------------
router.delete("/user-deletion/:username", async (req, res, next) => {
  console.log(req.params.username);
  const uname = req.params.username;

  if (uname != req.user.username) {
    console.log("401 error: Wrong username entered");
  } else {
    try {
      (deletedUser = await User.deleteOne({
        username: req.params.username,
      })),
        console.log(deletedUser);
      res.redirect(303, "/register");
    } catch (error) {
      console.log(error);
    }
  }
});

// ----------------------------------------------------

module.exports = router;
