import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import { getAllReviewsAndRatings } from "../thunks/reviewThunk";

const initialState = {
  success: false,
  message: null,
  error: undefined,
  reviews: undefined,
  reviewsCount: undefined,
  allRatings: undefined,
  totalRatings:undefined
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
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
  },
});

export const { clearMessage, clearErrors } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
