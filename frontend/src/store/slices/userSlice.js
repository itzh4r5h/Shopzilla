import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  cancelUpdateEmail,
  loadUser,
  resetPassword,
  sendEmailVerificationLink,
  sendOtpToEmail,
  sendPasswordResetTokenToEmail,
  signInUser,
  signOutUser,
  signUpUser,
  updateEmail,
  updateName,
  updatePassword,
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
    state.resendTokenIn = undefined;
  },
  rejected: (state, action) => {
    state.loading = false;
    state.isLoggedIn = false;
    state.error = action.payload;
  },
};

const updateActions = {
  pending: (state) => {
    state.message = null;
    state.success = false;
  },
  fulfilled: (state, action) => {
    state.message = action.payload.message;
    state.success = action.payload.success;
    state.user = action.payload.user;
    state.updated = true;
    state.resendLinkIn = undefined;
    state.resendOtpIn = undefined;
    state.resendTokenIn = undefined
    state.accountDeletionCountdownExpiresAt = undefined
  },
  rejected: (state, action) => {
    state.error = action.payload;
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    updated: undefined,
    resendOtpIn: undefined,
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
        state.resendOtpIn = undefined
        state.resendTokenIn = undefined
        state.updated = undefined
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
        state.sending = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, verifyEmail, { ...updateActions });

    handleAsyncThunk(builder, sendPasswordResetTokenToEmail, {
      pending: (state) => {
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
        state.sending = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, resetPassword, { ...actions });

    handleAsyncThunk(builder, updateName, { ...updateActions });

    handleAsyncThunk(builder, sendOtpToEmail, {
      pending: (state) => {
        state.sending = true;
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.resendOtpIn = action.payload.resendOtpIn;
      },
      rejected: (state, action) => {
        state.sending = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, updateEmail, { ...updateActions });

    handleAsyncThunk(builder, cancelUpdateEmail, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.updated = undefined;
        state.resendOtpIn = undefined;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      }
    });


    handleAsyncThunk(builder, updatePassword, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.updated = true
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });
  },
});

export const { clearErrors, clearMessage } = userSlice.actions;
export const userReducer = userSlice.reducer;
