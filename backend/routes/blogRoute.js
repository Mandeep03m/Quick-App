const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
}=require('../controllers/blogController');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/",protect, createBlog);
router.get("/", getAllBlogs);
router.get("/:id",protect, getBlogById);
router.put("/:id",protect, updateBlog);
router.delete("/:id",protect, deleteBlog);

module.exports = router;