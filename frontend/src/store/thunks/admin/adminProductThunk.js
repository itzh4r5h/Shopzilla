import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../../utils/sendAlerts";

export const addProduct = createAsyncThunk(
  "admin_product/add_product",
  async (productData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post("/admin/products", productData);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin_product/update_product",
  async ({ productData, id }, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/products/${id}`,
        productData
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getProduct = createAsyncThunk(
  "admin_product/get_product",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllProduct = createAsyncThunk(
  "admin_product/get_all_product",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin_product/delete_product",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/${id}`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
