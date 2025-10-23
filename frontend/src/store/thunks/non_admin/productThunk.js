import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../utils/sendAlerts";


export const getAllProducts = createAsyncThunk(
  "product/get_all_products",
  async ({page,keyword}, {dispatch,rejectWithValue}) => {
    try {
      const link = `/products/variants?page=${page}&keyword=${keyword}`
      const { data } = await axiosInstance.get(link)
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getFilteredProducts = createAsyncThunk(
  "product/get_filtered_products",
  async (filterOptions, {dispatch,rejectWithValue}) => {
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

      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const getProductDetails = createAsyncThunk(
  "product/get_product",
  async (variantId, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/products/variants/${variantId}`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
