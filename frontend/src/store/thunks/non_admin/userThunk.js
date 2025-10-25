import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../utils/sendAlerts";
import {
  setIsLoggedIn,
} from "../../slices/non_admin/authSlice";
import { clearResendLinkIn, resetResendOtpIn, setResendLinkIn } from "../../slices/non_admin/emailSlice";

export const loadUser = createAsyncThunk(
  "user/load_user",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      const {user} = data
      const {resendLinkIn} = user
      dispatch(setIsLoggedIn(true))
      dispatch(setResendLinkIn(resendLinkIn))
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/reset_password",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/users/reset/password/${userData.resetToken}`,
        { password: userData.password }
      );
      dispatch(setIsLoggedIn(true))
      dispatch(clearResendLinkIn())
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateImage = createAsyncThunk(
  "user/update_Image",
  async (image, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axiosInstance.patch(
        "/users/profile-pic",
        formData
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateName = createAsyncThunk(
  "user/update_name",
  async (name, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/users/name", { name });
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateEmail = createAsyncThunk(
  "user/update_email",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/users/email", {
        email: userData.email,
        otp: userData.otp,
      });
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const cancelUpdateEmail = createAsyncThunk(
  "user/cancel_update_email",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/email");
      dispatch(resetResendOtpIn())
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/update_password",
  async (passwords, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/users/password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const createPassword = createAsyncThunk(
  "user/create_password",
  async (newPassword, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        "/users/password/new",
        newPassword
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const addAddress = createAsyncThunk(
  "user/add_address",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/users/address", address);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/update_address",
  async (addressData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/users/address/${addressData.id}`,
        addressData.address
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateAddressIndex = createAsyncThunk(
  "user/update_address_index",
  async (shippingAddressIndex, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/users/address", {
        shippingAddressIndex,
      });
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllAddress = createAsyncThunk(
  "user/all_address",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/address");
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/delete_address",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/users/address/${id}`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);
