import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/blog";

export const fetchBlogs = createAsyncThunk("blogs/fetch", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
});

export const createBlog = createAsyncThunk("blogs/create", async (blogData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const updateBlog = createAsyncThunk("blogs/update", async ({ id, blogData }) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const deleteBlog = createAsyncThunk("blogs/delete", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load blogs";
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload.blog);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload.updatedBlog._id);
        if (index !== -1) {
          state.blogs[index] = action.payload.updatedBlog;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
