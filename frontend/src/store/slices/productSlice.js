import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, getProductDetails } from "../thunks/productThunks";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";

const productSlice = createSlice({
  name: "products",
  initialState: {
    keyword: "",
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
    products: undefined,
    productsCount: undefined,
    product: undefined,
    error: null,
    loading: true,
  },
  reducers: {
    saveKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllProducts, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getProductDetails, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      },
      rejected: (state, action) => {
        state.loading = true;
        state.error = action.payload;
      },
    });
  },
});

export const { saveKeyword, clearErrors } = productSlice.actions;
export const productReducer = productSlice.reducer;
