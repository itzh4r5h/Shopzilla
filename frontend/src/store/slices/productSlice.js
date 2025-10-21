import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, getFilteredProducts, getProductDetails } from "../thunks/productThunks";
import { handleAsyncThunk } from "../utils/handleAsyncThunk";

const productSlice = createSlice({
  name: "products",
  initialState: {
    keyword: "",
    page: 1,
    minPrice: undefined,
    maxPrice: undefined,
    variant: undefined,
    error: null,
    loading: true,
    variantsCount: undefined,
    variants: undefined,
    filters: undefined,
    attributes:undefined,
  },
  reducers: {
    saveKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductDetails: (state) => {
      state.variant= undefined
    }
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, getAllProducts, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.variants = action.payload.variants;
        state.variantsCount = action.payload.total;
        state.filters = action.payload.filters;
        state.attributes = action.payload.attributes;
      },
      rejected: (state, action) => {
        state.loading = false
        state.error = action.payload;
      },
    });
    handleAsyncThunk(builder, getFilteredProducts, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.variants = action.payload.variants;
        state.variantsCount = action.payload.total;
      },
      rejected: (state, action) => {
        state.loading = false
        state.error = action.payload;
      },
    });

    handleAsyncThunk(builder, getProductDetails, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.variant = action.payload.variant;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    });
    
   
  },
});

export const { saveKeyword, clearProductError,clearProductDetails,setPage } = productSlice.actions;
export const productReducer = productSlice.reducer;
