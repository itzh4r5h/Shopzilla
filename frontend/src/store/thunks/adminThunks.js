import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const getTotalProducts = createAsyncThunk(
  "admin/total_products",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/products");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalUsers = createAsyncThunk(
  "admin/total_users",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/users/total");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalOrders = createAsyncThunk(
  "admin/total_orders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "admin/all_users",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/users");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getOrdersByStatus = createAsyncThunk(
  "admin/get_orders_by_status",
  async (status, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/orders/${status}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "admin/add_product",
  async (productData, thunkAPI) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === "images") {
          // Handle multiple files
          productData[key].forEach((file) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const { data } = await axiosInstance.post("/admin/products", formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "admin/delete_product",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);
