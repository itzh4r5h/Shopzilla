import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";
import {
  addAddress,
  cancelUpdateEmail,
  createPassword,
  deleteAddress,
  getAllAddress,
  loadUser,
  resetPassword,
  sendEmailVerificationLink,
  sendOtpToEmail,
  sendPasswordResetTokenToEmail,
  signInUser,
  signOutUser,
  signUpUser,
  updateAddress,
  updateEmail,
  updateImage,
  updateName,
  updatePassword,
  verifyEmail,
} from "../thunks/userThunks";

const addressActions = {
  pending: (state) => {
    state.message = null;
    state.success = false;
    state.updatedAddress = undefined;
  },
  fulfilled: (state, action) => {
    state.message = action.payload.message;
    state.success = action.payload.success;
    state.updatedAddress = true;
  },
  rejected: (state, action) => {
    state.error = action.payload;
  },
};

const initialState = {
  error: null,
  uploading: false,
  updated: undefined,
  updatedAddress: undefined,
  resendOtpIn: undefined,
  resendTokenIn: undefined,
  resendLinkIn: undefined,
  accountDeletionCountdownExpiresAt: undefined,
  sending: false,
  success: false,
  loading: true,
  message: null,
  isLoggedIn: false,
  isPasswordExists: undefined,
  allShippingAddress: undefined,
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
    handleAsyncThunk(builder, signUpUser, {
      pending: (state) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isPasswordExists = action.payload.isPasswordExists
        state.isLoggedIn = true;
        state.accountDeletionCountdownExpiresAt =
          action.payload.accountDeletionCountdownExpiresAt;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, signInUser, {
      pending: (state) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.isPasswordExists = action.payload.isPasswordExists
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, loadUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.isPasswordExists = action.payload.isPasswordExists;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = null;
      },
    });

    handleAsyncThunk(builder, signOutUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        Object.assign(state, initialState); // reset all fields
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.loading = false
      },
      rejected: (state, action) => {
        state.loading = false
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

    handleAsyncThunk(builder, verifyEmail, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.resendLinkIn = undefined;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

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

    handleAsyncThunk(builder, resetPassword, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        Object.assign(state, initialState); // reset all fields
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, updateImage, {
      pending: (state) => {
        state.message = null;
        state.success = false;
        state.uploading = true;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.updated = true;
        state.uploading = false;
      },
      rejected: (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, updateName, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.updated = true;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

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

    handleAsyncThunk(builder, updateEmail, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.updated = true;
        state.resendOtpIn = undefined;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

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
      },
    });

    handleAsyncThunk(builder, updatePassword, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.updated = true;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, createPassword, {
      pending: (state) => {
        state.message = null;
        state.success = false;
      },
      fulfilled: (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.isPasswordExists = action.payload.isPasswordExists;
        state.updated = true;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, addAddress, { ...addressActions });

    handleAsyncThunk(builder, updateAddress, { ...addressActions });

    handleAsyncThunk(builder, deleteAddress, { ...addressActions });

    handleAsyncThunk(builder, getAllAddress, {
      pending: (state) => {
        state.allShippingAddress = undefined;
      },
      fulfilled: (state, action) => {
        state.allShippingAddress = action.payload.allShippingAddress;
      },
      rejected: (state, action) => {
        state.error = action.payload;
      },
    });
  },
});

export const { clearErrors, clearMessage } = userSlice.actions;
export const userReducer = userSlice.reducer;
