import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const addProductToCartOrUpdateQuantity = createAsyncThunk(
  "cart/add_to_cart_or_update_quantity",
  async (productData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/users/cart/${productData.id}`,{quantity:productData.quantity});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const getAllCartProducts = createAsyncThunk(
  "cart/get_all_cart_products",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/users/cart');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const removeProductFromCart = createAsyncThunk(
  "cart/remove_product_from_cart",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/users/cart/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

