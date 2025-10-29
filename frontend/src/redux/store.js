import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import pdfReducer from "./slices/pdfSlice";
import scraperReducer from "./slices/scrapeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    pdf: pdfReducer,
    scraper: scraperReducer,
  },
});
