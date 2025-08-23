import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const getAllCaetgories = createAsyncThunk(
  "category/get_categories",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/admin/products/categories');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const addCategory = createAsyncThunk(
  "category/add_category",
  async (categoryData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/admin/products/categories',categoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);



