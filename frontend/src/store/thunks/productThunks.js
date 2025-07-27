import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";


export const getAllProducts = createAsyncThunk(
  "products/getAll",
  async (keyword='', thunkAPI) => {
    try {
      const link = `/products?keyword=${keyword}`
      const { data } = await axiosInstance.get(link);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);


export const getProductDetails = createAsyncThunk(
  "products/getDetails",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);