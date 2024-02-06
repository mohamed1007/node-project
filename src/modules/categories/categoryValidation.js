import Joi from 'joi'

export const newCategorySchema = Joi.object({
    categoryName: Joi.string().required(),
    image: Joi.string().required(),
})