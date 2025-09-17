import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/AxiosInstance";

export const getAllYears = createAsyncThunk(
  "admin/get_years",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/payments/years`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalRevenue = createAsyncThunk(
  "admin/total_revenue",
  async (year, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/payments/revenue/${year}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getMonthlyRevenue = createAsyncThunk(
  "admin/monthly_revenue",
  async (year, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/payments/revenue/monthly/${year}`
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalProducts = createAsyncThunk(
  "admin/total_products",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/products");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalUsers = createAsyncThunk(
  "admin/total_users",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/users/total");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getTotalOrders = createAsyncThunk(
  "admin/total_orders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "admin/all_users",
  async (keyword = "", thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/users?keyword=${keyword}`
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/delete_user",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/users/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getOrdersByStatus = createAsyncThunk(
  "admin/get_orders_by_status",
  async (status, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/orders/${status}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/udpate_order_status",
  async (order, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/orders/${order.id}`, {
        orderStatus: order.status,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "admin/add_product",
  async (productData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/admin/products", productData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/update_product",
  async ({ productData, id }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/products/${id}`,
        productData
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getProduct = createAsyncThunk(
  "admin/get_product",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllProduct = createAsyncThunk(
  "admin/get_all_product",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/admin/products`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/delete_product",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getStockStatus = createAsyncThunk(
  "admin/stock_status",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/product");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const addOrUpdateVariant = createAsyncThunk(
  "admin/add_update_variant",
  async ({ edit, variant, id,variantId }, thunkAPI) => {
    try {
      const formData = new FormData();

      // Handle simple fields
      Object.keys(variant).forEach((key) => {
        if (key !== "attributes" && key !== "images") {
          formData.append(key, variant[key]);
        }
      });

      // Handle attributes as JSON
      formData.append("attributes", JSON.stringify(variant.attributes));

      // Handle images (nested objects)
      variant.images.forEach((img, index) => {
        formData.append(`images[${index}][color]`, img.color);
        img.files.forEach((file, fileIndex) => {
          if (file instanceof File || file instanceof Blob) {
            formData.append(`images[${index}][files][${fileIndex}]`, file)
          }else{
            formData.append(`images[${index}][files][${fileIndex}]`, JSON.stringify(file))
          }
        });
      });

      if (edit) {
        const { data } = await axiosInstance.put(
          `/admin/products/${id}/variants/${variantId}`,
          formData
        );
        return data;
      } else {
        const { data } = await axiosInstance.post(
          `/admin/products/${id}/variants`,
          formData
        );
        return data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

export const getAllVariants = createAsyncThunk(
  "admin/get_variants",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/products/${id}/variants`
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);
