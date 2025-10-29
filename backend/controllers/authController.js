const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')

dotenv.config()

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        
        const existingUser= await User.findOne({email})
        if(existingUser) {return res.status(400).json({message:"User already exists"})}
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const user=await User.create({name,email,password:hashedPassword})
        res.status(201).json({message:"SignUp Successfully",token:generateToken(user._id),user})
    } catch (error) {
        res.status(500).json({message:"Error in SignUp",error:error.message})
    }
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){ res.status(400).json({message:"User not Found"}) }
        
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){return res.status(400).json({message:"Invail Credential"})}
         res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id),
            user,
            });
    } catch (error) {
        res.status(500).json({message:"Error in login",error:error.message})
    }
}

module.exports = { signup, login };