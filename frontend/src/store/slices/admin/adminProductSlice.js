import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../../thunks/admin/adminProductThunk";

const initialState = {
  updated: undefined,
  loading: false,
  keyword: undefined,
  totalPages: undefined,
  page: 1,
  product: undefined,
  products: undefined,
  attributes: undefined,
  needSize: undefined
};

const commonActions = {
     pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.updated = true;
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
      }
}

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    saveKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, addProduct, {...commonActions});

    handleAsyncThunk(builder, getProduct, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.attributes = action.payload.attributes;
        state.needSize = action.payload.needSize;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getAllProduct, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, updateProduct, { ...commonActions });

    handleAsyncThunk(builder, deleteProduct, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.updated = true
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const { setPage, saveKeyword } = adminProductSlice.actions;
export const adminProductReducer = adminProductSlice.reducer;
