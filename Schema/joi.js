//joi Schema
const Joi = require('joi');

const authDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
    password2: Joi.string().valid(Joi.ref('password')).required().strict()
});

const loginDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
});
module.exports = {
    authDataSchema,
    loginDataSchema
}