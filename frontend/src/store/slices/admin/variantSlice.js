import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../utils/handleAsyncThunk";
import {
  addOrUpdateVariant,
  getAllVariants,
  deleteVariantOfProduct,
} from "../../thunks/admin/variantThunk";

const initialState = {
  updated: undefined,
  loading: false,
  variants: undefined,
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
    clearVariants: (state)=>{
      state.variants = undefined
    }
  },
  extraReducers: (builder) => {

    handleAsyncThunk(builder, addOrUpdateVariant, { ...commonActions });

    handleAsyncThunk(builder, deleteVariantOfProduct, { ...commonActions });

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
  },
});

export const {clearVariants } =
  variantSlice.actions;
export const variantReducer = variantSlice.reducer;
