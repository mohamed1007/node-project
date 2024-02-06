import mongoose from "mongoose";
let categorySchema = new mongoose.Schema({
    categoryName:  String,
      image: String,      
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
}) 
const categoryModel = mongoose.model('Category', categorySchema)
export default categoryModel ;