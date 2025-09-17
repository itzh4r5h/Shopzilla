import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  addProduct,
  addOrUpdateVariant,
  deleteProduct,
  deleteUser,
  getAllProduct,
  getAllUsers,
  getAllVariants,
  getAllYears,
  getMonthlyRevenue,
  getOrdersByStatus,
  getProduct,
  getStockStatus,
  getTotalOrders,
  getTotalProducts,
  getTotalRevenue,
  getTotalUsers,
  updateOrderStatus,
  updateProduct,
} from "../thunks/adminThunks";

const initialState = {
  error: null,
  success: false,
  message: null,
  updated: undefined,
  loading: false,
  years: undefined,
  totalRevenue: undefined,
  monthlyRevenue: undefined,
  totalProducts: undefined,
  totalUsers: undefined,
  totalOrders: undefined,
  stockStatus: undefined,
  keyword: undefined,
  users: undefined,
  userCount: undefined,
  orders: undefined,
  product: undefined,
  products: undefined,
  variants: undefined,
  attributes: undefined,
};

const commonActions = {
  pending: (state) => {
    state.loading = true;
    state.updated = undefined;
  },
  fulfilled: (state, action) => {
    state.success = action.payload.success;
    state.message = action.payload.message;
    state.updated = true;
    state.loading = false;
  },
  rejected: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    saveKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminMessage: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllYears, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.years = action.payload.years;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getTotalRevenue, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.totalRevenue = action.payload.totalRevenue;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getMonthlyRevenue, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getStockStatus, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.stockStatus = action.payload.stockStatus;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getTotalProducts, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.totalProducts = action.payload.totalProducts;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getAllUsers, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.users = action.payload.users;
        state.userCount = action.payload.userCount;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, deleteUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.updated = true;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

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
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, updateOrderStatus, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.updated = true;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, addProduct, { ...commonActions });

    handleAsyncThunk(builder, getProduct, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.attributes = action.payload.attributes;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getAllProduct, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, updateProduct, { ...commonActions });

    handleAsyncThunk(builder, deleteProduct, { ...commonActions });

    handleAsyncThunk(builder, addOrUpdateVariant, { ...commonActions });


    handleAsyncThunk(builder, getAllVariants, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.variants = action.payload.variants;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });
  },
});

export const { clearAdminMessage, clearAdminError, saveKeyword } =
  adminSlice.actions;
export const adminReducer = adminSlice.reducer;
