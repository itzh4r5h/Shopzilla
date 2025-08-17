import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  createOrderFromBuyNow,
  createOrderFromOfCartProducts,
  createPaymentOrder,
  deletePendingOrderAndPaymentOrder,
  getMyOrders,
  getMySinglOrder,
} from "../thunks/orderThunk";

const initialState = {
   error: null,
  success: false,
  message: null,
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
    state.success = action.payload.success;
    state.orderId = action.payload.orderId;
    state.loading = false;
  },
  rejected: (state, action) => {
    state.loading = false;
    state.error = action.payload;
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
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderMessage: (state) => {
      state.success = false;
      state.message = null;
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
        state.success = action.payload.success;
        state.razorpayOrder = action.payload.razorpayOrder;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getMySinglOrder, {
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
        state.error = action.payload;
      },
    });


    handleAsyncThunk(builder, deletePendingOrderAndPaymentOrder, {
        pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success
        state.orderId = undefined
        state.razorpayOrder = undefined
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export const { clearOrderMessage, clearOrderError ,resetOrderState} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
