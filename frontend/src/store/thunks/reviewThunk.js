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


export const createOrUpdateReview = createAsyncThunk(
  "review/create_update_review",
  async (review, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${review.id}/reviews`,{rating:review.rating,comment:review.comment});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/delete_review",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/products/${id}/reviews`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


