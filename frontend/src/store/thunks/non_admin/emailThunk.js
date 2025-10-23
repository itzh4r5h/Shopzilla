import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../utils/sendAlerts";
import { setUser } from "../../slices/non_admin/userSlice";

export const sendEmailVerificationLink = createAsyncThunk(
  "email/email_verification_link",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get("/users/verify/email");
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "email/verify_email",
  async (token, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/users/verify/email/${token}`);
      dispatch(setUser(data.user))
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const sendPasswordResetTokenToEmail = createAsyncThunk(
  "email/send_reset_token",
  async (email, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post("/users/reset/password", {
        email,
      });
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const sendOtpToEmail = createAsyncThunk(
  "email/send_otp",
  async (email, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post("/users/email", { email });
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);