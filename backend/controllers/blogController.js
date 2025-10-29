const Blog=require('../models/blogModel')

// Create Blog
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const created = await Blog.create({
      title,
      content,
      user: req.user.id,
    });
    const blog = await Blog.findById(created._id).populate("user", "name email");
    const response = { ...blog.toObject(), author: blog.user };
    res.status(201).json({ message: "Blog created successfully", blog: response });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    const response = blogs.map((b) => ({ ...b.toObject(), author: b.user }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get Single Blog
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const response = { ...blog.toObject(), author: blog.user };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (existing.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    ).populate("user", "name email");
    const response = updated ? { ...updated.toObject(), author: updated.user } : null;
    res.status(200).json({ message: "Blog updated", updatedBlog: response });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (existing.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
