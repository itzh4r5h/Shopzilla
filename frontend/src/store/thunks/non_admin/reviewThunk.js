import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../../utils/sendAlerts";

export const getAllReviewsAndRatings = createAsyncThunk(
  "review/get_reviews_ratings",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}/reviews`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getOrderedProductReviews = createAsyncThunk(
  "review/get_ordered_products_reviews",
  async (orderId, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/products/reviews/${orderId}`);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getRatings = createAsyncThunk(
  "review/get_ratings",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}/ratings`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const createOrUpdateReview = createAsyncThunk(
  "review/create_update_review",
  async (review, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${review.id}/reviews`,{rating:review.rating,comment:review.comment});
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/delete_review",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/products/${id}/reviews`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


