const { celebrate, Joi } = require("celebrate");

module.exports.userIdValidation = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
