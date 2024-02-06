import express from 'express';
import userModel from "../../../db/models/userModel.js"
import productModel from "../../../db/models/productModel.js"
import cartModel from "../../../db/models/cartModel.js"
import {validation ,isAdmin} from "../../validation/validation.js"
import {newCartSchema} from"./cartValidation.js"
import couponModel from "../../../db/models/couponModel.js"

const cartRoutes = express.Router();

const calcPAD = async (discount , price)=>{
    let discountPercentage = (100-discount)/100
    let PAD = price * discountPercentage
    return PAD
}

const calcTotalPrice = async (productList) => {
    const productPrices = await Promise.all(productList.map(async (listItem) => {
        const product = await productModel.findById(listItem);
        return product.finalPrice ? product.finalPrice : 0;
    }));
     const sum = productPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
     return sum; 
}

const getProducts = async (idArray)=>{
    const products = await Promise.all(idArray.map(async (listItem) => {
        const product = await productModel.findById(listItem);
        return product
    }));
    return products
}

cartRoutes.get("/cart",(req, res)=>{
    res.json({message:"welcome to ecommerce app"})
})

cartRoutes.post("/createCart",validation(newCartSchema), async (req, res) => {
    let totalPrice = await calcTotalPrice(req.body.products);
    let products = await getProducts(req.body.products)
    let isUser = await userModel.findById(req.body.user);
    if (isUser) {
        if (totalPrice > 0) {
            let newCart = await cartModel.create({
                user: isUser,
                totalPrice: totalPrice,
                products: products
            });
            res.json({ message: "Cart created", newCart });
        } else {
            res.json({ message: "Products not found or totalPrice is zero" });
        }
    } else {
        res.json({ message: "There is no user with this id" });
    }
})

cartRoutes.patch("/updateCart/:id/:cartId",isAdmin,validation(newCartSchema),async (req, res) => {
    let id = req.params.cartId
    let totalPrice = await calcTotalPrice(req.body.products);
    let products = await getProducts(req.body.products)
    let isUser = await userModel.findById(req.body.user);
    if (isUser){
        if (totalPrice > 0) {
            let updatedCart = await cartModel.findByIdAndUpdate(id,{
                user: isUser,
                totalPrice: totalPrice,
                products: products
            },{new: true}).populate(["products","user"]);
            res.json({ message: "Cart updated", updatedCart });
        } else {
            res.json({ message: "Products not found or totalPrice is zero" });
        }
    }else{
        res.json({ message: "There is no user with this id" });
    }
    
});

cartRoutes.patch("/applyCouponOnCart/:id/:carId",async (req, res) => {
    let foundCoupon  = await couponModel.findById(req.params.id)
    let discount = null
    if(foundCoupon){
        discount = foundCoupon.value
    }else{
        res.json({message: 'couldnt find coupon'})
    }
    let found = await cartModel.findById(req.params.carId)
    if(found){
        let PAD = await calcPAD(discount , found.totalPrice)
        found.priceAfterDiscount = PAD 
        await found.save()
        res.json({message:"coupon applied",found})
    }else{
        res.json({message:"product not found"})
    }
})


export default cartRoutes;
