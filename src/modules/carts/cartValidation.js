import Joi from 'joi'

export const newCartSchema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().required()
})