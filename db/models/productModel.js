import mongoose from "mongoose";
let productSchema = new mongoose.Schema({
    productName: { type: String},
    slug: { type: String },
    finalPrice: { type: Number },
    priceAfterDiscount: { type: Number },
    image: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
      stock: { type: Number },
}) 
const productModel = mongoose.model('Product', productSchema)
export default productModel ;