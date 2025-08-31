import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import { addCategory, addSubCategories, deleteCategory, deleteSubCategory, getAllAttributes, getAllCaetgories, getAllSubCaetgories, updateAttributes, updateCategoryName, updateSubCategoryName } from "../thunks/categoryThunk";


const initialState = {
  error: null,
  success: false,
  message: null,
  categories: undefined,
  subcategories: undefined,
  attributes: undefined,
  updated: undefined

};

const commonActions = {
  pending: (state) => {
    state.loading = true;
    state.updated = undefined
  },
  fulfilled: (state, action) => {
    state.success = action.payload.success;
    state.message = action.payload.message;
    state.updated = true
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
    clearSubCategories: (state) => {
     state.subcategories = undefined
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllCaetgories, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined
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

    handleAsyncThunk(builder, getAllSubCaetgories, {
      pending: (state) => {
        state.loading = true;
         state.updated = undefined
      },
      fulfilled: (state, action) => {
        state.subcategories = action.payload.subcategories;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getAllAttributes, {
      pending: (state) => {
        state.loading = true;
         state.updated = undefined
      },
      fulfilled: (state, action) => {
        state.attributes = action.payload.attributes;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, addCategory, {...commonActions});

    handleAsyncThunk(builder, updateCategoryName, {...commonActions});

    handleAsyncThunk(builder, deleteCategory, {...commonActions});

    handleAsyncThunk(builder, updateSubCategoryName, {...commonActions});

    handleAsyncThunk(builder, addSubCategories, {...commonActions});

    handleAsyncThunk(builder, deleteSubCategory, {...commonActions});

    handleAsyncThunk(builder, updateAttributes, {...commonActions});

    
  },
});

export const { clearCategoryMessage, clearCategoryError,clearSubCategories } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
