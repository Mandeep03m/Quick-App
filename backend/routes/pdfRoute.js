const express=require('express')
const multer=require('multer')
const fs=require('fs')
const path=require('path')
const {summarizePDF}=require('../controllers/pdfController')
const { protect } = require('../middleware/authMiddleware')

const router=express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>cb(null, Date.now() + "-" + file.originalname)
})

const upload=multer({storage})

// Frontend sends field name "file" in FormData
router.post("/summarize",protect,upload.single("file"),summarizePDF)

module.exports=router
