import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError, successAlert } from "../../../utils/sendAlerts";

export const getAllCaetgories = createAsyncThunk(
  "category/get_categories",
  async (_, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get('/admin/products/categories');
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllSubCaetgories = createAsyncThunk(
  "category/get_subcategories",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/categories/${id}/subcategories`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllAttributes = createAsyncThunk(
  "category/get_attributes",
  async (ids, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/categories/${ids.id}/subcategories/${ids.subId}/attributes`);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const addCategory = createAsyncThunk(
  "category/add_category",
  async (categoryData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.post('/admin/products/categories',categoryData);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateCategoryName = createAsyncThunk(
  "category/update_category_name",
  async (categoryData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}`,categoryData);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete_category",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/categories/${id}`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateSubCategoryName = createAsyncThunk(
  "category/update_subcategory_name",
  async (categoryData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}/subcategories/${categoryData.subId}`,categoryData);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const addSubCategories = createAsyncThunk(
  "category/add_subcategories",
  async (categoryData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${categoryData.id}/subcategories`,{subcategories:categoryData.subcategories});
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "category/delete_subcategory",
  async (ids, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/categories/${ids.id}/subcategories/${ids.subId}`);
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateAttributes = createAsyncThunk(
  "category/update_attributes",
  async (attrData, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/products/categories/${attrData.id}/subcategories/${attrData.subId}/attributes`,{attributes:attrData.attributes});
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);



