// Note that JWT is not used in the current implementation of the application

const jsonwebtoken = require("jsonwebtoken");

function authorise(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ message: "Access denied :(" });
  }
  try {
    const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token :(" });
  }
}

module.exports = authorise;
