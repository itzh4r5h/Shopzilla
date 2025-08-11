import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const signUpUser = createAsyncThunk(
  "user/signup",
  async (userData, thunkAPI) => {
    try {
      // userData is an object in which includes name, email and password
      const { data } = await axiosInstance.post("/users/signup", userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const signInUser = createAsyncThunk(
  "user/signin",
  async (userData, thunkAPI) => {
    try {
      // userData is an object in which includes email and password
      const { data } = await axiosInstance.post("/users/signin", userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const signOutUser = createAsyncThunk(
  "user/signout",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/users/signout");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const sendEmailVerificationLink = createAsyncThunk(
  "user/email_verification_link",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/users/verify/email");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "user/verify_email",
  async (token, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/users/verify/email/${token}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const loadUser = createAsyncThunk("user/load", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/users/me");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const sendPasswordResetTokenToEmail = createAsyncThunk(
  "user/send_reset_token",
  async (email, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/users/reset/password", {
        email,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/reset_password",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        `/users/reset/password/${userData.resetToken}`,
        { password: userData.password }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateImage = createAsyncThunk(
  "user/update_Image",
  async (image, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axiosInstance.patch(
        "/users/profile-pic",
        formData
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateName = createAsyncThunk(
  "user/update_name",
  async (name, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch("/users/name", { name });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const sendOtpToEmail = createAsyncThunk(
  "user/send_otp",
  async (email, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/users/email", { email });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateEmail = createAsyncThunk(
  "user/update_email",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch("/users/email", {
        email: userData.email,
        otp: userData.otp,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const cancelUpdateEmail = createAsyncThunk(
  "user/cancel_update_email",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/users/email");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/update_password",
  async (passwords, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch("/users/password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const createPassword = createAsyncThunk(
  "user/create_password",
  async (newPassword, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        "/users/password/new",
        newPassword
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  "user/add_address",
  async (address, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/users/address", address);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/update_address",
  async (addressData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        `/users/address/${addressData.id}`,
        addressData.address
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllAddress = createAsyncThunk(
  "user/all_address",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/users/address");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/delete_address",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/users/address/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);
