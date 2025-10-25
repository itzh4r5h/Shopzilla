import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  deleteUser,
  getAllUsers,
} from "../../thunks/admin/adminUserThunk";

const initialState = {
  updated: undefined,
  loading: false,
  search: undefined,
  users: undefined,
  userCount: undefined,
  totalPages: undefined,
  page: 1,
};


const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    saveSearch: (state, action) => {
      state.search = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    
    handleAsyncThunk(builder, getAllUsers, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.users = action.payload.users;
        state.userCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, deleteUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.updated = true;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

   

    
  },
});

export const {  saveSearch,setPage } =
  adminUserSlice.actions;
export const adminUserReducer = adminUserSlice.reducer;
