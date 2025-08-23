import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./slices/productSlice";
import { userReducer } from "./slices/userSlice";
import { adminReducer } from "./slices/adminSlice";
import { cartReducer } from "./slices/cartSlice";
import { orderReducer } from "./slices/orderSlice";
import { reviewReducer } from "./slices/reviewSlice";
import { categoryReducer } from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    admin: adminReducer,
    cart: cartReducer,
    order: orderReducer,
    review: reviewReducer,
    category: categoryReducer,
  },
});
