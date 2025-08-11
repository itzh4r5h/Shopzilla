import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./slices/productSlice";
import { userReducer } from "./slices/userSlice";
import { adminReducer } from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    admin: adminReducer,
  },
});
