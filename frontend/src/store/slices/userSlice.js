import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  loadUser,
  resetPassword,
  sendEmailVerificationLink,
  sendPasswordResetTokenToEmail,
  signInUser,
  signOutUser,
  signUpUser,
  updateName,
  verifyEmail,
} from "../thunks/userThunks";

const actions = {
  pending: (state) => {
    state.loading = true;
  },
  fulfilled: (state, action) => {
    state.loading = false;
    state.user = action.payload.user;
    state.isLoggedIn = true;
    state.accountDeletionCountdownExpiresAt =
      action.payload.accountDeletionCountdownExpiresAt;
  },
  rejected: (state, action) => {
    state.loading = false;
    state.isLoggedIn = false;
    state.error = action.payload;
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    resendTokenIn: undefined,
    resendLinkIn: undefined,
    accountDeletionCountdownExpiresAt: undefined,
    sending: false,
    success: false,
    loading: true,
    message: null,
    isLoggedIn: false,
    user: undefined,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, signUpUser, { ...actions });

    handleAsyncThunk(builder, signInUser, { ...actions });

    handleAsyncThunk(builder, loadUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = null;
      },
    });

    handleAsyncThunk(builder, signOutUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.resendLinkIn = undefined;
        state.accountDeletionCountdownExpiresAt = undefined;
        state.isLoggedIn = false;
        state.user = undefined;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = undefined;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, sendEmailVerificationLink, {
      pending: (state) => {
        state.loading = false;
        state.sending = true;
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.resendLinkIn = action.payload.resendLinkIn;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.sending = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, verifyEmail, {
      pending: (state) => {
        state.loading = true;
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, sendPasswordResetTokenToEmail, {
      pending: (state) => {
        state.loading = false;
        state.sending = true;
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.resendTokenIn = action.payload.resendTokenIn;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.sending = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, resetPassword, { ...actions });

    handleAsyncThunk(builder, updateName, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });
  },
});

export const { clearErrors, clearMessage } = userSlice.actions;
export const userReducer = userSlice.reducer;
