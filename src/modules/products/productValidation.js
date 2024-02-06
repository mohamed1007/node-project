import Joi from 'joi'

export const newProductSchema = Joi.object({
    productName: Joi.string().required(),
    finalPrice: Joi.number().min(0).required(),
    image: Joi.string().uri().required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    discount: Joi.number().integer().min(0)
})