import express from 'express';
import bcrypt from 'bcrypt';
import userModel from "../../../db/models/userModel.js"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {validation,isAdmin} from "../../validation/validation.js"
import {newUserSchema} from"./userValidation.js"

const userRoutes = express.Router();

const secretKey = process.env.JWT_SECRET_KEY||"1020503505"
const generateToken = (id)=>{
    return jwt.sign({id},secretKey,{expiresIn:"1h"});
}
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ehab16354@gmail.com",
        pass:"zenw htba ufni qmmn"
    }
})
const sendEmail = async (email,token)=>{
    
    const mailOptions = {
        from:"ehab16354@gmail.com",
        to:email,
        subject:"reset password",
        text: token
    }
    await transporter.sendMail(mailOptions)
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, (process.env.JWT_SECRET_KEY||"1020503505"));
        return decoded;
    } catch (error) {
        return null;
    }
};

userRoutes.get("/user",(req, res)=>{
    res.json({message:"welcome to ecommerce app"})
})

userRoutes.post("/user/signup",validation(newUserSchema), async (req, res) => {
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password,10)

    let found = await userModel.findOne({userName: req.body.userName})

    if(found) {
        res.json({Message : "user already registered"})
    }else{
        let newUser = await userModel.create({
            userName:req.body.userName,
            email:req.body.email,
            password: hashedPassword,
            role:req.body.role,
            isVerified:false,
            addresses:req.body.addresses
            })
        res.json({Message : "user added", newUser})
    }
})

userRoutes.get("/user/signin",async (req , res)=>{
    let found = await userModel.findOne({userName: req.body.userName})
    if(found) {
        const password = req.body.password
        const correctPassword = await bcrypt.compare(password,found.password)
        if(correctPassword){
            res.json({Message: "User found ",found});
        }
        else{
            res.json({Message: "Incorrect password"})
        }
        
    }
    else{
        res.json({Message: "User not found"})
    }
})

userRoutes.post("/user/forgetPassword" , async (req, res)=>{
    const email = req.body.email

    let found = await userModel.findOne({email})
    
    if (found) {
        const token = generateToken(found._id)
        found.resetPasswordToken = token
        await found.save()
        await sendEmail(email,token)
        res.json({ message: "Token sent to your email" });
    }else{
        res.json({Message: "User not found"})
    }
})

userRoutes.post("/user/resetPassword", async (req, res)=>{
    const email = req.body.email
    const token = req.body.token
    const newPassword = req.body.newPassword
    const isDecoded = verifyToken(token)
    if(isDecoded) {
        let found = await userModel.findOne({email})
        if (found){
            const hashedPassword = await bcrypt.hash(newPassword,10)
            found.password = hashedPassword
            found.resetPasswordToken = null
            await found.save()
            res.json({Message: "password resetted successfully"})
        }else{
            res.json({Message: "User not found"})
        }
    }else{
        res.json({Message: "invalid token"})
    }
})

userRoutes.patch("/user/update/:id",validation(newUserSchema), async (req,res)=>{
    let id = req.params.id
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password,10)
    let found = await userModel.findByIdAndUpdate(id,{
        userName:req.body.userName,
        email:req.body.email,
        password: hashedPassword,
        role:req.body.role,
        addresses:req.body.addresses 
    },{new:true})
    if(found){
        res.json({Message: "found and updated user",found})
    }else{
        res.json({message:"user not found"})
    }
})

userRoutes.delete("/user/:id",isAdmin,async (req, res) => {
    let found = await userModel.findByIdAndDelete(req.params.id)
    if(found){
        res.json({Message: "found and deleted user",found})
    }else{
        res.json({Message: "user not found"})
    }
})

export default userRoutes;


