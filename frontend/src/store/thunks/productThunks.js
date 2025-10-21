import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";


export const getAllProducts = createAsyncThunk(
  "products/get_all_products",
  async ({page,keyword}, thunkAPI) => {
    try {
      const link = `/products/variants?page=${page}&keyword=${keyword}`
      const { data } = await axiosInstance.get(link)
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

export const getFilteredProducts = createAsyncThunk(
  "products/get_filtered_products",
  async (filterOptions, thunkAPI) => {
    try {
      let url = '/products/variants/filtered?'
      const keys = Object.keys(filterOptions)
      keys.forEach((key,index)=>{
        if(index > 0 && index < keys.length){
          url += `&${key}=${filterOptions[key]}`
        }else{
          url += `${key}=${filterOptions[key]}`
        }
      })
      console.log(url);
      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);


export const getProductDetails = createAsyncThunk(
  "products/get_product",
  async (variantId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/products/variants/${variantId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);
