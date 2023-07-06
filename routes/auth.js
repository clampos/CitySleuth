const express = require("express");
const router = express.Router();
const passport = require("passport");
const genPassword = require("../utils/passwordUtil").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const isAuth = require("./authMiddle").isAuth;
const isAdmin = require("./authMiddle").isAdmin;

// GET routes

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

// router.get("/login-success", (req, res, next) => {
//   res.send(
//     '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
//   );
// });

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

// POST routes
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

// Authentication 1 to check user input
//   const { error } = loginAuthentication(req.body);
//   if (error) {
//     return res.status(400).send({ message: error["details"][0]["message"] });
//   }

//   // Authentication 2 to check if user exists
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(400).send({ message: "User does not exist :(" });
//   }

//   // Authentication 3 to check user password
//   const passwordAuthentication = await bcryptjs.compare(
//     req.body.password,
//     user.password
//   );
//   if (!passwordAuthentication) {
//     return res.status(400).send({ message: "Password is wrong! :(" });
//   }

//   // Initiate login session
//   try {
//     session = req.session;
//     session.userid = req.body.username;
//     console.log(req.session);
//     res.send("Hey there, welcome");
//     // Generate an auth-token
//     const token = jsonwebtoken.sign(
//       { _id: user._id },
//       process.env.TOKEN_SECRET
//     );

//     res.header("auth-token", token).send({ "auth-token": token });
//     res.redirect("/home");
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/logout", async (req, res) => {
//   req.session.destroy;
//   res.redirect("/register");
// });

// console.log(req.body);

// // Authentication 1 to check user input
// const { error } = registerAuthentication(req.body);
// if (error) {
//   return res.status(400).send({ message: error["details"][0]["message"] });
// }

// // Authentication 2 to check if user exists (username)
// const userExists_1 = await User.findOne({ username: req.body.username });
// if (userExists_1) {
//   return res
//     .status(400)
//     .send({ message: "An account with the same username already exists" });
// }

// // Authentication 3 to check if user exists (email)
// const userExists_2 = await User.findOne({ email: req.body.email });
// if (userExists_2) {
//   return res.status(400).send({
//     message: "An account is already registered to this email address",
//   });
// }

// // Creating a hashed representation of the password
// const salt = await bcryptjs.genSalt(5);
// const hashedPassword = await bcryptjs.hash(req.body.password, salt);

// Inserting data

// TODO: All following code to be modified - currently based on MiniWall
// POST: login an existing user - WORKS
// Code reused with permission from auth.js in mini-film-auth at https://github.com/steliosot/cc.git
