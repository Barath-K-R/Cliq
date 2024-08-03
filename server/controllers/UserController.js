import UserModel from "../models/UserModel.js";

export const addUser=async(req,res)=>{
    try {
        const newUser=new UserModel(req.body);
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const dbUser=await UserModel.findOne({username});
        if(!dbUser){
            res.status(401).json("user not found");
        }
        else{
            if(dbUser.password!==password)
                res.status(401).json("password not matched")
            else
            res.status(200).json({messgae:"user authenticated successfully",user:dbUser});
        }
    } catch (error) {
        console.log(error);
    }
}

export const getUser=async(req,res)=>{
    const {id}=req.params;
    try {
        const user=await UserModel.findById(id);
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }
}