import express from 'express';
import categoryModel from "../../../db/models/categoryModel.js"
import {validation ,isAdmin} from "../../validation/validation.js"
import {newCategorySchema} from"./categoryValidation.js"

const categoryRoutes = express.Router();

categoryRoutes.get("/category",(req, res)=>{
    res.json({message:"welcome to ecommerce app"})
})

categoryRoutes.post("/addCategory/:id",isAdmin,validation(newCategorySchema), async (req, res)=>{
    let foundCategory = await categoryModel.findOne({categoryName:req.body.categoryName})
    if(foundCategory){
        res.json({message: "category already exists"})
    }else{
        let newCategory = await categoryModel.create({
            categoryName:req.body.categoryName,
            image:req.body.image,
            createdBy:req.params.id
        })
        res.json({message: "category added successfully",newCategory})
    }
})

categoryRoutes.patch("/updateCategory/:id/:catId",isAdmin,validation(newCategorySchema), async (req, res) => {
    let id = req.params.catId
    let found = await categoryModel.findByIdAndUpdate(id,{
        categoryName:req.body.categoryName,
        image:req.body.image
    },{new:true})
    if(found){
        res.json({message: "category updated successfully",found})
    }else{
        res.json({message: "category not found"})
    }
})

categoryRoutes.delete("/deleteCategory/:id/:catId",isAdmin, async (req, res) => {
    let id = req.params.catId
    let found = await categoryModel.findByIdAndDelete(id)
    if(found){
        res.json({message: "category deleted successfully",found})
    }else{
        res.json({message: "category not found"})
    }
})

categoryRoutes.get("/allCategories", async(req,res)=>{
    let category = await categoryModel.find()
    res.json({message: "all categories",category})
})

categoryRoutes.get("/getCategory/:name", async(req,res)=>{
    let categoryName = req.params.name
    let found = await categoryModel.findOne({categoryName})
    if(found){
        res.json({message: "category found",found})
    }else{
        res.json({message: "category not found"})
    }
})

export default categoryRoutes;
