import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  addProductToCartOrUpdateQuantity,
  getAllCartProducts,
  removeProductFromCart,
} from "../thunks/cartThunk";

const initialState = {
  success: false,
  message: null,
  loading: false,
  cartProducts: undefined,
  cartProductsQuantity: undefined,
  totalPrice: undefined,
  updated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    quantityUpdated: (state) => {
      state.updated = true;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, addProductToCartOrUpdateQuantity, {
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
    });

    handleAsyncThunk(builder, getAllCartProducts, {
      pending: (state) => {
        state.loading = true;
        state.updated = false;
      },
      fulfilled: (state, action) => {
        state.cartProducts = action.payload.cartProducts;
        state.cartProductsQuantity = action.payload.cartProductsQuantity;
        state.totalPrice = action.payload.totalPrice;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, removeProductFromCart, {
      pending: (state) => {
        state.loading = true;
        state.updated = false;
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
    });
  },
});

export const { clearMessage, clearErrors, quantityUpdated } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
