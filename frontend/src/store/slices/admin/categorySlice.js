import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import { addCategory, addSubCategories, deleteCategory, deleteSubCategory, getAllAttributes, getAllCaetgories, getAllSubCaetgories, getCategoriesAndSubCategories, updateAttributes, updateCategoryName, updateSubCategoryName } from "../../thunks/admin/categoryThunk";


const initialState = {
  categories: undefined,
  subcategories: undefined,
  attributes: undefined,
  updated: undefined,
  loading: false,
  categoriesAndSubcategories: []
};

const commonActions = {
  pending: (state) => {
    state.loading = true;
    state.updated = undefined
  },
  fulfilled: (state, action) => {
    state.updated = true
    state.loading = false;
  },
  rejected: (state, action) => {
    state.loading = false;
  },
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
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
      },
    });

    handleAsyncThunk(builder, getCategoriesAndSubCategories, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.categoriesAndSubcategories = action.payload.categories;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
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
