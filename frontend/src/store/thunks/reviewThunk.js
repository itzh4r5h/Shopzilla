import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const getAllReviewsAndRatings = createAsyncThunk(
  "review/get_reviews_ratings",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}/reviews`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);



