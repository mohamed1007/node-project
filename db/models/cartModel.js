import mongoose from "mongoose";
let cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    totalPrice:Number,
    priceAfterDiscount:Number,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
}) 
const cartModel = mongoose.model('Cart', cartSchema)
export default cartModel ;