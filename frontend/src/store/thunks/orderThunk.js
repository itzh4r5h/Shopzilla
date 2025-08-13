import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const createOrderFromOfCartProducts = createAsyncThunk(
  "order/create_order_cart_products",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/orders',{buyNow:false});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const createOrderFromBuyNow = createAsyncThunk(
  "order/create_order_buy_now",
  async (productData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/orders/${productData.id}/${productData.quantity}`,{buyNow:true});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const createPaymentOrder = createAsyncThunk(
  "order/create_payment_order",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/payments/order',{orderId});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const getMyOrders = createAsyncThunk(
  "order/get_my_orders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/orders');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const getMySinglOrder = createAsyncThunk(
  "order/get_my_single_order",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


