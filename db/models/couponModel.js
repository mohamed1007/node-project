import mongoose from "mongoose";
let couponSchema = new mongoose.Schema({
    couponCode:  String,
    value: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    updatedBy: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    deletedBy: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    expireIn: Date,
    deleted : {type : Boolean , default: false}
}, { timestamps: true });  
const couponModel = mongoose.model('Coupon', couponSchema)
export default couponModel ;