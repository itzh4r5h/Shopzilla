import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import { addProduct, deleteProduct, getAllUsers, getOrdersByStatus, getTotalOrders, getTotalProducts, getTotalUsers, updateProduct } from "../thunks/adminThunks";

const initialState = {
    success:false,
    message: null,
    loading: false,
    totalProducts: undefined,
    totalUsers: undefined,
    totalOrders: undefined,
    users: undefined,
    orders: undefined,
}


const commonActions = {
   pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = false
        state.error = action.payload;
      },
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.success = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getTotalProducts, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.totalProducts = action.payload.totalProducts;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });


    handleAsyncThunk(builder, getTotalUsers, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.totalUsers = action.payload.totalUsers;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });


    handleAsyncThunk(builder, getTotalOrders, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.totalOrders = action.payload.totalOrders;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });


    handleAsyncThunk(builder, getAllUsers, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.users = action.payload.users;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getOrdersByStatus, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.orders = action.payload.orders;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = true
        state.error = action.payload;
      },
    });


    handleAsyncThunk(builder, addProduct, {...commonActions});


    handleAsyncThunk(builder, updateProduct, {...commonActions});


    handleAsyncThunk(builder, deleteProduct, {...commonActions});




    
  },
});

export const { clearMessage, clearErrors } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
