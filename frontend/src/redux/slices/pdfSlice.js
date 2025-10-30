import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://quick-app-408j.onrender.com/api/pdf/summarize";

export const summarizePdf = createAsyncThunk(
  "pdf/summarize",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to summarize PDF';
      return rejectWithValue(message);
    }
  }
);

const pdfSlice = createSlice({
  name: "pdf",
  initialState: { summary: "", loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(summarizePdf.pending, (state) => {
        state.loading = true;
      })
      .addCase(summarizePdf.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(summarizePdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to summarize PDF";
      });
  },
});

export default pdfSlice.reducer;
