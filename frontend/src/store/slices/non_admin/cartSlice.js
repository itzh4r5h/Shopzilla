import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  addProductToCartOrUpdateQuantity,
  getAllCartProducts,
  removeProductFromCart,
} from "../../thunks/non_admin/cartThunk";

const initialState = {
  loading: false,
  cartProducts: undefined,
  cartProductsQuantity: undefined,
  totalPrice: undefined,
  updated: undefined,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    quantityUpdated: (state) => {
      state.updated = true;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, addProductToCartOrUpdateQuantity, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.updated = action.payload.updated
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
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
      },
    });

    handleAsyncThunk(builder, removeProductFromCart, {
      pending: (state) => {
        state.loading = true;
        state.updated = false;
      },
      fulfilled: (state, action) => {
        state.updated = true
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const {quantityUpdated } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
