import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const getAllCaetgories = createAsyncThunk(
  "category/get_categories",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/admin/products/categories');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllSubCaetgories = createAsyncThunk(
  "category/get_subcategories",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/categories/${id}/subcategories`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllAttributes = createAsyncThunk(
  "category/get_attributes",
  async (ids, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/categories/${ids.id}/subcategories/${ids.subId}/attributes`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const addCategory = createAsyncThunk(
  "category/add_category",
  async (categoryData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/admin/products/categories',categoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const updateCategoryName = createAsyncThunk(
  "category/update_category_name",
  async (categoryData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}`,categoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete_category",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/categories/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const updateSubCategoryName = createAsyncThunk(
  "category/update_subcategory_name",
  async (categoryData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}/subcategories/${categoryData.subId}`,categoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const addSubCategories = createAsyncThunk(
  "category/add_subcategories",
  async (categoryData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}/subcategories`,{subcategories:categoryData.subcategories});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "category/delete_subcategory",
  async (ids, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/categories/${ids.id}/subcategories/${ids.subId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const updateAttributes = createAsyncThunk(
  "category/update_attributes",
  async (attrData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${attrData.id}/subcategories/${attrData.subId}/attributes`,{attributes:attrData.attributes});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);



