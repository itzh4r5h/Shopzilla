import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../utils/handleAsyncThunk";
import {
  addOrUpdateVariant,
  getAllVariants,
  deleteVariantOfProduct,
  getOutOfStockVariants,
  updateStock,
} from "../../thunks/admin/variantThunk";

const initialState = {
  page: 1,
  keyword: "",
  updated: undefined,
  loading: false,
  variants: undefined,
  out_of_stock_variants: undefined,
  totalPages: undefined,
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
  },
};

const variantSlice = createSlice({
  name: "variant",
  initialState,
  reducers: {
    clearVariants: (state) => {
      state.variants = undefined;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, addOrUpdateVariant, { ...commonActions });

    handleAsyncThunk(builder, deleteVariantOfProduct, { ...commonActions });

    handleAsyncThunk(builder, updateStock, { ...commonActions });

    handleAsyncThunk(builder, getAllVariants, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.variants = action.payload.variants;
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });

    handleAsyncThunk(builder, getOutOfStockVariants, {
      pending: (state) => {
        state.loading = true;
        state.updated = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.out_of_stock_variants = action.payload.out_of_stock_variants;
        state.totalPages = action.payload.totalPages
      },
      rejected: (state, action) => {
        state.loading = false;
      },
    });
  },
});

export const { clearVariants,setKeyword,setPage } = variantSlice.actions;
export const variantReducer = variantSlice.reducer;
