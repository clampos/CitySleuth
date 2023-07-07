const joi = require("joi");

const registerValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(6).max(256),
    // TODO validate email
    email: joi.string().required().min(7).max(256),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

const loginValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(6).max(256),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
