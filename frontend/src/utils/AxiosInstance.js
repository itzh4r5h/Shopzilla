import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api/v1/`,
  withCredentials: true, // 🔥 Required for sending/receiving cookies
});

// Automatically set Content-Type for FormData
axiosInstance.interceptors.request.use((config) => {
  // If the request data is FormData, set multipart/form-data
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  config.headers['Accept'] = 'application/json'
  return config
  
});
