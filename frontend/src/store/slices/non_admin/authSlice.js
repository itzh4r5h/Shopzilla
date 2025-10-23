import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../utils/handleAsyncThunk";
import {
  signInUser,
  signOutUser,
  signUpUser,
} from "../../thunks/non_admin/authThunk";

const initialState = {
  accountDeletionCountdownExpiresAt: undefined,
  loading: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    clearIsLoggedIn: (state) => {
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, signUpUser, {
      pending: (state) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.accountDeletionCountdownExpiresAt =
          action.payload.accountDeletionCountdownExpiresAt;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, signInUser, {
      pending: (state) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, signOutUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });
  },
});

export const {setIsLoggedIn,clearIsLoggedIn} = authSlice.actions

export const authReducer = authSlice.reducer;
