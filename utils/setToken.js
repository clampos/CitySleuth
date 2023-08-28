const jwt = require("jsonwebtoken");

function setToken(req, res, next) {
  const user = req.user;

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.TOKEN_SECRET
  );

  res.cookie("jwt", token, { httpOnly: true, secure: true });
}

module.exports = setToken;
