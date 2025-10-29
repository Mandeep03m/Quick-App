const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config();
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB Connected")
    } catch (error) {
     console.log("MongoDB Connection Failed:",error.message)
     process.exit(1)   
    }
}
module.exports=connectDB