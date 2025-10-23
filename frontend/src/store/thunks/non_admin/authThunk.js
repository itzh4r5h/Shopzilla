import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../utils/sendAlerts";
import {
  clearIsPasswordExists,
  clearUser,
  setIsPasswordExists,
  setUser,
} from "../../slices/non_admin/userSlice";

export const signUpUser = createAsyncThunk(
  "auth/signup",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      // userData is an object in which includes name, email and password
      const { data } = await axiosInstance.post("/users/signup", userData);
      dispatch(setIsPasswordExists(data.isPasswordExists));
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const signInUser = createAsyncThunk(
  "auth/signin",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      // userData is an object in which includes email and password
      const { data } = await axiosInstance.post("/users/signin", userData);
      dispatch(setIsPasswordExists(data.isPasswordExists));
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/signout");
      dispatch(clearUser());
      dispatch(clearIsPasswordExists())
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
