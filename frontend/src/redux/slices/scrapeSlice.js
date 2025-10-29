import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/scraper";

export const fetchResults = createAsyncThunk(
  "scraper/fetch",
  async (keyword) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}?keyword=${keyword}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.results;
  }
);

const scraperSlice = createSlice({
  name: "scraper",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch results";
      });
  },
});

export default scraperSlice.reducer;
