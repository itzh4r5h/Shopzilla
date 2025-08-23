import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import { getAllCaetgories } from "../thunks/categoryThunk";


const initialState = {
  error: null,
  success: false,
  message: null,
  categories: undefined,
  subcategories: undefined,

};

const commonActions = {
  pending: (state) => {
    state.loading = true;
  },
  fulfilled: (state, action) => {
    state.success = action.payload.success;
    state.message = action.payload.message;
    state.loading = false;
  },
  rejected: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCategoryMessage: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllCaetgories, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.categories = action.payload.categories;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    
  },
});

export const { clearCategoryMessage, clearCategoryError } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
