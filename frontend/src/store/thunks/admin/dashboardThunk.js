import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../utils/sendAlerts";

export const getAllYears = createAsyncThunk(
  "dashboard/get_years",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/payments/years`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getTotalRevenue = createAsyncThunk(
  "dashboard/total_revenue",
  async (year, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/payments/revenue/${year}`);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getMonthlyRevenue = createAsyncThunk(
  "dashboard/monthly_revenue",
  async (year, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(
        `/payments/revenue/monthly/${year}`
      );
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getTotalProducts = createAsyncThunk(
  "dashboard/total_products",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get("/admin/products/variants");
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getTotalUsers = createAsyncThunk(
  "dashboard/total_users",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get("/admin/users/total");
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getTotalOrders = createAsyncThunk(
  "dashboard/total_orders",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const getStockStatus = createAsyncThunk(
  "dashboard/stock_status",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/products/variants/stock_status"
      );
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
