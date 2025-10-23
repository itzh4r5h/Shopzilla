import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "./slices/alertSlice";
import { emailReducer } from "./slices/non_admin/emailSlice";
import { authReducer } from "./slices/non_admin/authSlice";
import { userReducer } from "./slices/non_admin/userSlice";
import { dashboardReducer } from "./slices/admin/dashboardSlice";
import { adminOrderReducer } from "./slices/admin/adminOrderSlice";
import { adminProductReducer } from "./slices/admin/adminProductSlice";
import { adminUserReducer } from "./slices/admin/adminUserSlice";
import { variantReducer } from "./slices/admin/variantSlice";
import { productReducer } from "./slices/non_admin/productSlice";
import { cartReducer } from "./slices/non_admin/cartSlice";
import { orderReducer } from "./slices/non_admin/orderSlice";
import { reviewReducer } from "./slices/non_admin/reviewSlice";
import { categoryReducer } from "./slices/admin/categorySlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    email: emailReducer,
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    adminOrder: adminOrderReducer,
    adminProduct: adminProductReducer,
    adminUser: adminUserReducer,
    variant: variantReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    review: reviewReducer
  },
});
