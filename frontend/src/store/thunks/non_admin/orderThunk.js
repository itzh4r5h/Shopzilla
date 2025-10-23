import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../utils/sendAlerts";

export const createOrderFromOfCartProducts = createAsyncThunk(
  "order/create_order_cart_products",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post('/orders',{buyNow:false});
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const createOrderFromBuyNow = createAsyncThunk(
  "order/create_order_buy_now",
  async ({id,productData}, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post(`/orders/${id}`,{buyNow:true,...productData});
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const createPaymentOrder = createAsyncThunk(
  "order/create_payment_order",
  async (orderId, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post('/payments/order',{orderId});
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const getMyOrders = createAsyncThunk(
  "order/get_my_orders",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get('/orders');
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const getMyOrderDetails = createAsyncThunk(
  "order/get_my_order_details",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const deletePendingOrderAndPaymentOrder = createAsyncThunk(
  "order/delete_order",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/orders/${id}`);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);



