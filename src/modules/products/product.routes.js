import express from 'express';
import productModel from "../../../db/models/productModel.js"
import couponModel from "../../../db/models/couponModel.js"
import {validation ,isAdmin} from "../../validation/validation.js"
import {newProductSchema} from"./productValidation.js"
import slugify from 'slugify';


const productRoutes = express.Router();

const couponDiscount = async (id) => {
    let found  = await couponModel.findById(id)
    if(found){
        return found.value
    }else{
        res.json({message: 'couldnt find coupon'})
    }
}

const calcPAD = async (discount , price)=>{
    let discountPercentage = (100-discount)/100
    let PAD = price * discountPercentage
    return PAD
}

productRoutes.get("/product",(req, res)=>{
    res.json({message:"welcome to ecommerce app"})
})

productRoutes.post("/addProduct/:id", isAdmin , validation(newProductSchema) , async (req, res)=>{
    let found = await productModel.findOne({productName: req.body.productName})
    if(found){
        res.json({message:"product already exists"})
    }else{
        let slug = slugify(req.body.productName) 
        let newProduct = await productModel.create({
            productName: req.body.productName,
            slug: slug,
            finalPrice: req.body.finalPrice,
            image : req.body.image,
            category: req.body.category,
            stock: req.body.stock
        })
        res.json({message:"product added successfully",newProduct})
    }
})

productRoutes.patch("/updateProduct/:id/:proId",isAdmin,validation(newProductSchema), async (req, res) => {
    let id = req.params.proId
    let discount = (100-req.body.discount)/100;
    let PAD = req.body.finalPrice * discount;
    let slug = slugify(req.body.productName)
    let found = await productModel.findByIdAndUpdate(id,{
        productName: req.body.productName,
            slug: slug,
            finalPrice: req.body.finalPrice,
            priceAfterDiscount:PAD,
            image : req.body.image,
            category: req.body.category,
            stock: req.body.stock
    },{new:true})
    if(found){
        res.json({message: "product updated successfully",found})
    }else{
        res.json({message: "product not found"})
    }
})

productRoutes.delete("/deleteProduct/:id/:proId",isAdmin, async (req, res) => {
    let id = req.params.proId
    let found = await productModel.findByIdAndDelete(id)
    if(found){
        res.json({message: "product deleted successfully",found})
    }else{
        res.json({message: "product not found"})
    }
})

productRoutes.get("/paginatedProducts", async (req, res) => {
    let page = parseInt(req.body.page)
    let size = parseInt(req.body.size)
    let products = await productModel.find().skip((page-1)*size).limit(size)
    res.json({"page": page, "products": products})
})

productRoutes.get("/getProduct/:name", async(req,res)=>{
    let productName = req.params.name
    let found = await productModel.findOne({productName})
    if(found){
        res.json({message: "product found",found})
    }else{
        res.json({message: "product not found"})
    }
})

productRoutes.get("/getProductByCategry/:category", async(req,res)=>{
    let category = req.params.category
    let found = await productModel.find({category})
    if(found){
        res.json({message: "found",found})
    }else{
        res.json({message: "product not found"})
    }
})

productRoutes.patch("/applyCouponOnProduct/:id/:proId",async (req, res) => {
    let discount = await couponDiscount(req.params.id)
    let found = await productModel.findById(req.params.proId)
    if(found){
        let PAD = await calcPAD(discount , found.finalPrice)
        found.priceAfterDiscount = PAD 
        await found.save()
        res.json({message:"coupon applied",found})
    }else{
        res.json({message:"product not found"})
    }
})

export default productRoutes;
