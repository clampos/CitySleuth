const bcryptjs = require("bcryptjs");
const connection = require("../config/database");
const User = connection.models.User;

function validPassword() {
  const passwordValidation = bcryptjs.compare(req.body.password, user.password);
  if (!passwordValidation) {
    return res.status(400).send({ message: "Password is wrong! :(" });
  }
}

module.exports.validPassword = validPassword;
