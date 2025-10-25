import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  getOrdersByStatus,
  updateOrderStatus,
} from "../../thunks/admin/adminOrderThunk";

const initialState = {
  loading: false,
  orders: undefined,
  updated: undefined,
};


const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  extraReducers: (builder) => {

    handleAsyncThunk(builder, getOrdersByStatus, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.orders = action.payload.orders;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, updateOrderStatus, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.updated = true;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const adminOrderReducer = adminOrderSlice.reducer;
