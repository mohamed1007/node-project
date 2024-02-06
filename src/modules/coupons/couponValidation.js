import Joi from 'joi'

export const newCouponSchema = Joi.object({
    couponCode: Joi.string().required(),
    value: Joi.number().required(),
    expireIn: Joi.number().required()
})
