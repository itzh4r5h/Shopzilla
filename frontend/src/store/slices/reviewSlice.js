import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import { createOrUpdateReview, deleteReview, getAllReviewsAndRatings, getOrderedProductReviews, getRatings } from "../thunks/reviewThunk";

const initialState = {
  error: null,
  success: false,
  message: null,
  reviews: undefined,
  orderedProductReviews: undefined,
  review: undefined,
  reviewsCount: undefined,
  ratings: undefined,
  allRatings: undefined,
  totalRatings:undefined,
  reviewed: undefined,
};

const commonActions = {
    pending: (state) => {
        state.loading = true;
        state.reviewed = undefined;
        state.success = false
        state.message = null
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.reviewed = true
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviewed = undefined;
      },
}

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearReviewMessage: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllReviewsAndRatings, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.reviews = action.payload.reviews;
        state.reviewsCount = action.payload.reviewsCount;
        state.allRatings = action.payload.allRatings;
        state.totalRatings = action.payload.totalRatings;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getRatings, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.ratings = action.payload.ratings,
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getOrderedProductReviews, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.orderedProductReviews = action.payload.orderedProductReviews,
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, createOrUpdateReview, {...commonActions});

    handleAsyncThunk(builder, deleteReview, {...commonActions});


  },
});

export const { clearReviewMessage, clearReviewError } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
