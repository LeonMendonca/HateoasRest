import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().required(),
  role: Joi.string().valid('everyone', 'admin', 'moderator').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().required(),
})

const articleSchema = Joi.object({
  title: Joi.string().max(50).required(),
  author: Joi.string().max(50).required(),
})

const articlePathSchema = Joi.object({
  title: Joi.string().max(50),
  author: Joi.string().max(50)
})

export { userSchema, loginSchema, articleSchema };
