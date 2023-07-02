const express = require("express");
const router = express.Router();
// body-parser deprecated as express has its own body parser
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

var session;

// Initial code produced with help from https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
const oneDay = 1000 * 60 * 60 * 24;
router.use(
  sessions({
    secret: process.env.TOKEN_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser);

const User = require("../models/User");
const {
  registerAuthentication,
  loginAuthentication,
} = require("../authentications/authentication");

const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

// TODO: All following code to be reviewed - currently based on MiniWall for purposes of setting up initial authentications
// POST: register an existing user - WORKS
router.post("/register", async (req, res) => {
  console.log(req.body);

  // Authentication 1 to check user input
  const { error } = registerAuthentication(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  // Authentication 2 to check if user exists (username)
  const userExists_1 = await User.findOne({ username: req.body.username });
  if (userExists_1) {
    return res
      .status(400)
      .send({ message: "An account with the same username already exists" });
  }

  // Authentication 3 to check if user exists (email)
  const userExists_2 = await User.findOne({ email: req.body.email });
  if (userExists_2) {
    return res.status(400).send({
      message: "An account is already registered to this email address",
    });
  }

  // Creating a hashed representation of the password
  const salt = await bcryptjs.genSalt(5);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  // Inserting data
  const user = new User({
    first_name: req.body.first_name,
    surname: req.body.surname,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
  }
});

// TODO: All following code to be modified - currently based on MiniWall
// POST: login an existing user - WORKS
// Code reused with permission from auth.js in mini-film-auth at https://github.com/steliosot/cc.git
router.post("/login", async (req, res) => {
  // Authentication 1 to check user input
  const { error } = loginAuthentication(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  // Authentication 2 to check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User does not exist :(" });
  }

  // Authentication 3 to check user password
  const passwordAuthentication = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!passwordAuthentication) {
    return res.status(400).send({ message: "Password is wrong! :(" });
  }

  // Initiate login session
  try {
    session = req.session;
    session.userid = req.body.username;
    console.log(req.session);
    res.send("Hey there, welcome");
    // Generate an auth-token
    const token = jsonwebtoken.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET
    );

    res.header("auth-token", token).send({ "auth-token": token });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy;
  res.redirect("/register");
});

module.exports = router;
