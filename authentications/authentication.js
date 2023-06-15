const joi = require("joi");

const registerAuthentication = (data) => {
  const schemaAuthentication = joi.object({
    username: joi.string().required().min(6).max(256),
    // TODO validate email
    email: joi.string().required().min(7).max(256),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaAuthentication.validate(data);
};

const loginAuthentication = (data) => {
  const schemaAuthentication = joi.object({
    email: joi.string().required().min(7).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaAuthentication.validate(data);
};

module.exports.registerAuthentication = registerAuthentication;
module.exports.loginAuthentication = loginAuthentication;
