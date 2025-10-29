const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const schema=mongoose.Schema
const userSchema=new schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
    },
    password:{
        type:String,
        minlength:0,
        required:true
    }
})

const User=mongoose.model("User",userSchema)
module.exports=User