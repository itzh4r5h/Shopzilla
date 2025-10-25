import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../../utils/sendAlerts";

export const getAllUsers = createAsyncThunk(
  "admin_user/all_users",
  async ({page,search}, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/users?page=${page}&search=${search}`
      );
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin_user/delete_user",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/users/${id}`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);