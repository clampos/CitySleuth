module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      msg: "This is a protected route. Please go to the login page and sign in.",
    });
  }
};
