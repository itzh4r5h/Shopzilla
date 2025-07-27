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
    productsCount: 0,
    product: undefined,
    error: null,
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
        state.products = undefined;
        state.productsCount = 0;
      },
      fulfilled: (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getProductDetails, {
      pending: (state) => {
        state.product = undefined;
      },
      fulfilled: (state, action) => {
        state.product = action.payload.product;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });
  },
});

export const { saveKeyword, clearErrors } = productSlice.actions;
export const productReducer = productSlice.reducer;
