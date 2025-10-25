import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../../utils/sendAlerts";
import { makeUrl } from "../../../utils/helpers";

export const getFilters = createAsyncThunk(
  "product/get_filters",
  async (keyword, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/products/variants/filters?keyword=${keyword}`
      );
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/get_all_products",
  async (filterOptions, { dispatch, rejectWithValue }) => {
    try {
      const url = makeUrl("/products/variants?", filterOptions);

      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "product/get_product",
  async (variantId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/products/variants/${variantId}`
      );
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
