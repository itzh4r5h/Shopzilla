import { createSlice } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getFilters,
  getProductDetails,
} from "../../thunks/non_admin/productThunk";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";

const productSlice = createSlice({
  name: "product",
  initialState: {
    keyword: "",
    page: 1,
    minPrice: undefined,
    maxPrice: undefined,
    variant: undefined,
    error: null,
    loading: false,
    totalPages: undefined,
    variants: undefined,
    filters: undefined,
    attributes: undefined,
  },
  reducers: {
    saveKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearProductDetails: (state) => {
      state.variant = undefined;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getFilters, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.filters = action.payload.filters;
        state.attributes = action.payload.attributes;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getAllProducts, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.variants = action.payload.variants;
        state.totalPages = action.payload.totalPages;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getProductDetails, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.variant = action.payload.variant;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const { saveKeyword, clearProductDetails, setPage } =
  productSlice.actions;
export const productReducer = productSlice.reducer;
