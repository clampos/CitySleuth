const bcryptjs = require("bcryptjs");

// Modify
function genPassword(password) {
  const salt = bcryptjs.genSalt(5);
  const hashedPassword = bcryptjs.hash(password, salt);
  return hashedPassword;
}

function validPassword(password) {
  const passwordValidation = bcryptjs.compare(req.body.password, password);
  if (!passwordValidation) {
    return res;
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
