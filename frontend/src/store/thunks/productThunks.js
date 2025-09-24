import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";


export const getAllProducts = createAsyncThunk(
  "products/get_all_products",
  async (keyword='', thunkAPI) => {
    try {
      const link = `/products/variants?keyword=${keyword}`
      const { data } = await axiosInstance.get(link);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);


export const getProductDetails = createAsyncThunk(
  "products/get_product",
  async ({productId,variantId}, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/products/${productId}/variants/${variantId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);
