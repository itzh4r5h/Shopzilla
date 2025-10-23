import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../utils/handleAsyncThunk";
import {
  addAddress,
  cancelUpdateEmail,
  createPassword,
  deleteAddress,
  getAllAddress,
  loadUser,
  resetPassword,
  updateAddress,
  updateAddressIndex,
  updateEmail,
  updateImage,
  updateName,
  updatePassword,
} from "../../thunks/non_admin/userThunk";

const addressActions = {
  pending: (state) => {
    state.updatedAddress = undefined;
    state.loading = false;
  },
  fulfilled: (state) => {
    state.updatedAddress = true;
  },
  rejected: (state) => {
    state.updatedAddress = undefined;
    state.loading = false;
  },
};

const commonUpdateActions = {
  pending: (state) => {
    state.updated = false;
  },
  fulfilled: (state, action) => {
    state.user = action.payload.user;
    state.updated = true;
  },
  rejected: (state, action) => {
    state.updated = false;
  },
};

const initialState = {
  uploading: false,
  updated: false,
  updatedAddress: undefined,
  loading: false,
  allShippingAddress: undefined,
  user: undefined,
  isPasswordExists: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
    setIsPasswordExists: (state, action) => {
      state.isPasswordExists = action.payload;
    },
    clearIsPasswordExists: (state) => {
      state.isPasswordExists = undefined;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, loadUser, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isPasswordExists = action.payload.isPasswordExists
      },
      rejected: (state, action) => {
        state.loading = false;
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
        state.isPasswordExists = action.payload.isPasswordExists
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, updateImage, {
      pending: (state) => {
        state.uploading = true;
      },
      fulfilled: (state, action) => {
        state.user = action.payload.user;
        state.updated = true;
        state.uploading = false;
      },
      rejected: (state, action) => {
        state.uploading = false;
      },
    });

    handleAsyncThunk(builder, updateName, { ...commonUpdateActions });

    handleAsyncThunk(builder, updateEmail, { ...commonUpdateActions });

    handleAsyncThunk(builder, cancelUpdateEmail, {
      fulfilled: (state, action) => {
        state.user = action.payload.user;
        state.updated = undefined;
      },
    });

    handleAsyncThunk(builder, updatePassword, { ...commonUpdateActions });

    handleAsyncThunk(builder, createPassword, {
      pending: (state) => {
        state.updated = false;
      },
      fulfilled: (state, action) => {
        state.isPasswordExists = action.payload.isPasswordExists
        state.updated = true;
      },
      rejected: (state, action) => {
        state.updated = false;
      },
    });

    handleAsyncThunk(builder, addAddress, { ...addressActions });

    handleAsyncThunk(builder, updateAddress, { ...addressActions });

    handleAsyncThunk(builder, updateAddressIndex, {
      fulfilled: (state, action) => {
        state.user = action.payload.user;
      },
    });

    handleAsyncThunk(builder, deleteAddress, { ...addressActions });

    handleAsyncThunk(builder, getAllAddress, {
      pending: (state) => {
        state.allShippingAddress = undefined;
        state.updatedAddress = undefined;
      },
      fulfilled: (state, action) => {
        state.allShippingAddress = action.payload.allShippingAddress;
      },
    });
  },
});

export const { setUser, clearUser,setIsPasswordExists,clearIsPasswordExists } = userSlice.actions;

export const userReducer = userSlice.reducer;
