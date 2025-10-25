import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  getAllYears,
  getMonthlyRevenue,
  getStockStatus,
  getTotalOrders,
  getTotalProducts,
  getTotalRevenue,
  getTotalUsers,
} from "../../thunks/admin/dashboardThunk";

const initialState = {
  loading: false,
  years: undefined,
  totalRevenue: undefined,
  monthlyRevenue: undefined,
  totalVariants: undefined,
  totalUsers: undefined,
  totalOrders: undefined,
  stockStatus: undefined,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllYears, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.years = action.payload.years;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getTotalRevenue, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.totalRevenue = action.payload.totalRevenue;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getMonthlyRevenue, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getStockStatus, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.stockStatus = action.payload.stockStatus;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getTotalProducts, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.totalVariants = action.payload.totalVariants;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getTotalUsers, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.totalUsers = action.payload.totalUsers;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getTotalOrders, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.totalOrders = action.payload.totalOrders;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
