import couponModel from "../../../db/models/couponModel.js"
import {validation ,isAdmin} from "../../validation/validation.js"
import {newCouponSchema} from"./couponValidation.js"
import express from "express"

const couponRoutes = express.Router();

const expirationDate = async (number)=>{
    let currentDate = new Date(Date.now())
    let expiringDate = new Date(currentDate.getTime()+number*24*60*60*1000)
    return expiringDate
}

const isDeleted = async (req,res,next)=>{
    let deleted = await couponModel.findById(req.params.couId)
    if(deleted){
        if(deleted.deleted){
            res.json({message: 'coupon is already deleted'})
        }else{
            next()
        }
    }else{
        res.json({message: 'coupon is not found'})
    }
}

couponRoutes.get("/coupon",(req, res)=>{
    res.json({message:"welcome to ecommerce app"})
})

couponRoutes.post("/addCoupon/:id" , isAdmin , validation(newCouponSchema) , async (req, res)=>{
    let found = await couponModel.findOne({couponCode:req.body.couponCode})
    if(found){
        res.json({message:"coupon code already used"})
    }else{
        let expireIn = await  expirationDate(req.body.expireIn)
        let newCoupon = await couponModel.create({
            couponCode:req.body.couponCode,
            value:req.body.value,
            createdBy:req.params.id,
            expireIn:expireIn,
        })
        res.json({message:"new coupon added successfully",newCoupon})
    }
})

couponRoutes.patch("/updateCoupon/:id/:couId" , isDeleted , isAdmin , validation(newCouponSchema) , async (req, res) => {
    let id = req.params.couId
    let expireIn = await  expirationDate(req.body.expireIn)
    let found = await couponModel.findByIdAndUpdate(id,{
        couponCode:req.body.couponCode,
        value:req.body.value,
        updatedBy:req.params.id,
        expireIn:expireIn,
    },{new:true}).populate(["createdBy", "deletedBy", "updatedBy"])
    if(found){
        res.json({message:"found and updated",found})
    }else{
        res.json({message:"coupon not found"})
    }
})

couponRoutes.delete("/deleteCoupon/:id/:couId" , isDeleted , isAdmin  , async (req, res) => {
    let id = req.params.couId
    let found = await couponModel.findByIdAndUpdate(id,{
        deletedBy:req.params.id,
        deleted :true
    },{new:true}).populate(["createdBy", "deletedBy", "updatedBy"])
    if(found){
        res.json({message:"found and deleted",found})
    }else{
        res.json({message:"coupon not found"})
    }
})

couponRoutes.get("/allCoupons",async(req, res)=>{
    let coupons = await couponModel.find({deleted: false}).populate(["createdBy", "deletedBy", "updatedBy"])
    let deletedCoupons = await couponModel.find({deleted: true}).populate(["createdBy", "deletedBy", "updatedBy"])
    if(coupons.length>0){
        res.json({message: "Coupons",coupons , "deleted coupons":deletedCoupons})
    }else{
        res.json({message: "no coupon found"})
    }
})

couponRoutes.patch("/retrieveCoupon/:id/:couId" , isAdmin , async (req, res) => {
    let id = req.params.couId
    let found = await couponModel.findByIdAndUpdate(id,{
        deleted :false
    },{new:true}).populate(["createdBy", "deletedBy", "updatedBy"])
    if(found){
        res.json({message:"found and retrieved",found})
    }else{
        res.json({message:"coupon not found"})
    }
})

export default couponRoutes;