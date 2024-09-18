const express=require('express');
const router=express.Router();
const User=require('../models/user')
const validator = require('validator');
const bcrypt=require('bcrypt');
const Register=async (req,res)=>{
    
    try{
        const {name,email,password,confirmPassword}=req.body;
        const existingUser=await User.findOne({email});
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email"})
        }
        if(password.length<8){
            return res.status(400).json({message:"Password should be atleast 8 characters long"})   
        }
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await new User({name,email,password:hashedPassword});
        await newUser.save();
        
        return res.status(200).json({message:"User created successfully"})
    }
    catch(err){
        console.log("error hai bhaiya"+err);
        return res.status(500).json({message:err})
    }
    
}
module.exports=Register;