import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../utils/sendAlerts";

export const getOrdersByStatus = createAsyncThunk(
  "admin_order/get_orders_by_status",
  async (status, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/admin/orders/${status}`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin_order/udpate_order_status",
  async (order, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/orders/${order.id}`, {
        orderStatus: order.status,
      });
       successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);