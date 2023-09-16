const joi = require("joi");

const registerValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().alphanum().required().min(6).max(20),
    email: joi.string().required().min(7).max(40),
    password: joi.string().alphanum().required().min(6).max(20),
  });
  return schemaValidation.validate(data);
};

module.exports.registerValidation = registerValidation;
