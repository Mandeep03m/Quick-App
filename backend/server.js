const express=require("express")
const cors=require('cors')
const mongoose=require('mongoose')
const connectDB=require("./config/db")

const authRoute=require("./routes/authRoute")
const pdfRoute=require("./routes/pdfRoute")
const blogRoute=require("./routes/blogRoute")
const scraperRoute=require("./routes/scraperRoute")

const dotenv=require("dotenv")
dotenv.config({ path: './.env' })

console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app=express()
connectDB()

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use(express.json())
app.use("/uploads",express.static("uploads"))

app.use('/api/auth',authRoute)
app.use('/api/blog',blogRoute)
app.use('/api/scraper',scraperRoute)
app.use('/api/pdf',pdfRoute)

const PORT=process.env.PORT
app.listen(PORT,()=>console.log(`Server is running on ${PORT}`))
