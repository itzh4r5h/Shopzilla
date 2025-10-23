import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../utils/sendAlerts";

export const addProductToCartOrUpdateQuantity = createAsyncThunk(
  "cart/add_to_cart_or_update_quantity",
  async ({ id, cartData }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/users/cart/${id}`, cartData);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllCartProducts = createAsyncThunk(
  "cart/get_all_cart_products",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/cart");
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "cart/remove_product_from_cart",
  async ({ id, colorIndex }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/users/cart/${id}/${colorIndex}`
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
