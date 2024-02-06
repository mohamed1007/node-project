import Joi from 'joi'

export const newUserSchema = Joi.object({
    userName:Joi.string().min(3).max(20).required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
    role:Joi.string().valid("admin","user").required(),
    addresses:Joi.array().required()
})