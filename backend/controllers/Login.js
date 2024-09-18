const express=require('express');
const router=express.Router();
const User=require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const JWT_SECRET = "4089089309832";

const createToken = (user) => {
    
    const payload = {
        id: user._id,   // The unique user ID
        email: user.email,  // The user's email
        name: user.name     // Any other information you want to include
    };

    // Options for the token
    const options = {
        expiresIn: 2 * 24 * 60 * 60,  // Token will expire in 1 hour
    };

    // Create and sign the token
    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};

const Login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}).populate("password");
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        if(!await bcrypt.compare(password, user.password)){
            
            return res.status(400).json({message:"Wrong Password"})
        }
        const token=createToken(user);

        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })

        return res.status(200).json({message:"Login Successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
module.exports=Login;