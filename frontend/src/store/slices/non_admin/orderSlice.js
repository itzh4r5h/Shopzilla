import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  createOrderFromBuyNow,
  createOrderFromOfCartProducts,
  createPaymentOrder,
  deletePendingOrderAndPaymentOrder,
  getMyOrders,
  getMyOrderDetails,
} from "../../thunks/non_admin/orderThunk";

const initialState = {
  loading: false,
  orderId: undefined,
  razorpayOrder: undefined,
  orders:undefined,
  order: undefined,
  orderQuantity: undefined
};

const commonActions = {
  pending: (state) => {
    state.loading = true;
  },
  fulfilled: (state, action) => {
    state.orderId = action.payload.orderId;
    state.loading = false;
  },
  rejected: (state, action) => {
    state.loading = false;
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orderId = undefined;
      state.razorpayOrder = undefined;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, createOrderFromOfCartProducts, {
      ...commonActions,
    });

    handleAsyncThunk(builder, createOrderFromBuyNow, { ...commonActions });

    handleAsyncThunk(builder, createPaymentOrder, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.razorpayOrder = action.payload.razorpayOrder;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getMyOrders, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.orders = action.payload.orders
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getMyOrderDetails, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.order = action.payload.order
        state.orderQuantity = action.payload.orderQuantity
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });


    handleAsyncThunk(builder, deletePendingOrderAndPaymentOrder, {
        pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.orderId = undefined
        state.razorpayOrder = undefined
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      }
    });
  },
});

export const {resetOrderState} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
