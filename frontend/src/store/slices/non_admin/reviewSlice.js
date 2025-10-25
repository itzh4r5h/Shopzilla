import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import { createOrUpdateReview, deleteReview, getAllReviewsAndRatings, getOrderedProductReviews, getRatings } from "../../thunks/non_admin/reviewThunk";

const initialState = {
  reviews: undefined,
  orderedProductReviews: undefined,
  review: undefined,
  reviewsCount: undefined,
  ratings: undefined,
  allRatings: undefined,
  totalRatings:undefined,
  reviewed: undefined,
  loading: false,
};

const commonActions = {
    pending: (state) => {
        state.loading = true;
        state.reviewed = undefined;
      },
      fulfilled: (state, action) => {
        state.reviewed = true
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.reviewed = undefined;
      },
}

const reviewSlice = createSlice({
  name: "review",
  initialState,
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllReviewsAndRatings, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.reviews = action.payload.reviews;
        state.reviewsCount = action.payload.reviewsCount;
        state.allRatings = action.payload.allRatings;
        state.totalRatings = action.payload.totalRatings;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getRatings, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.ratings = action.payload.ratings,
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getOrderedProductReviews, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.orderedProductReviews = action.payload.orderedProductReviews,
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, createOrUpdateReview, {...commonActions});

    handleAsyncThunk(builder, deleteReview, {...commonActions});


  },
});

export const reviewReducer = reviewSlice.reducer;
