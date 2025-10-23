import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/AxiosInstance";
import { rejectWithError } from "../../utils/sendAlerts";

export const addOrUpdateVariant = createAsyncThunk(
  "variant/add_update_variant",
  async ({ edit, variant, id, variantId }, {dispatch,rejectWithValue}) => {
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
      // images loop start
      variant.images.forEach((img, index) => {
        formData.append(`images[${index}][color]`, img.color);
        formData.append(`images[${index}][price]`, img.price);

        // if true
        if (variant.needSize) {
          // sizes loop start
          img.sizes.forEach((sz, szIndex) => {
            formData.append(
              `images[${index}][sizes][${szIndex}][size]`,
              sz.size
            );
            formData.append(
              `images[${index}][sizes][${szIndex}][stock]`,
              sz.stock
            );
          });
          // sizes loop end
        } else {
          formData.append(`images[${index}][stock]`, img.stock);
        }

        // files loop start
        img.files.forEach((file, fileIndex) => {
          if (file instanceof File || file instanceof Blob) {
            formData.append(`images[${index}][files][${fileIndex}]`, file);
          } else {
            formData.append(
              `images[${index}][files][${fileIndex}]`,
              JSON.stringify(file)
            );
          }
        });
        // files loop end
      });
      // images loop end

      if (edit) {
        const { data } = await axiosInstance.put(
          `/admin/products/${id}/variants/${variantId}`,
          formData
        );
        successAlert(dispatch, data.message);
        return data;
      } else {
        const { data } = await axiosInstance.post(
          `/admin/products/${id}/variants`,
          formData
        );
        successAlert(dispatch, data.message);
        return data;
      }
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const getAllVariants = createAsyncThunk(
  "variant/get_variants",
  async (id, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/products/${id}/variants`
      );
      return data;
    } catch (error) {
     return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteVariantOfProduct = createAsyncThunk(
  "variant/delete_variant",
  async ({ productId, variantId }, {dispatch,rejectWithValue}) => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/products/${productId}/variants/${variantId}`
      );
      successAlert(dispatch, data.message);
      return data;
    } catch (error) {
      return rejectWithError(error, dispatch, rejectWithValue);
    }
  }
);