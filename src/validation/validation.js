import userModel from "../../db/models/userModel.js";

export const validation = (Schema)=>{
    return (req , res , next) => {
        let check = Schema.validate(req.body,{abortEarly:false});
        if(check && check.error){
            res.json({message:"validation error",error:check.error})
        }else{
            next()
        }
    }
} 

export const isAdmin = async (req, res, next) => {
    let found = await userModel.findById(req.params.id)
    if(found){
        if(found.role == 'admin'){
            next()
        }else{
            res.json({message:"only admin is allowed"})
        }
    }else{
        res.json({message:"user not found"})
    }
}