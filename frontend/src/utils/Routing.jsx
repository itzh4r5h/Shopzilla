import { Route, Routes } from "react-router";
import { Home } from "../pages/Home";
import { Cart } from "../pages/Cart";
import { Profile } from "../pages/profile/Profile";
import { NotFound } from "../pages/NotFound";
import { ProductDetails } from "../pages/ProductDetails";
import { Orders } from "../pages/Orders";
import { OrderDetails } from "../pages/OrderDetails";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Users } from "../pages/dashboard/Users";
import { UserOrders } from "../pages/dashboard/UserOrders";
import { AllProducts } from "../pages/dashboard/product/AllProducts";
import { ResetPassword } from "../pages/ResetPassword";
import { SignInOrSignUp } from "../pages/SignInOrSignUp";
import { Products } from "../pages/Products";
import { useSelector } from "react-redux";
import { Categories } from "../pages/dashboard/category/Categories";
import { SubCateogries } from "../pages/dashboard/category/SubCateogries";
import { Attributes } from "../pages/dashboard/category/Attributes";
import { SingleProductInfo } from "../pages/dashboard/product/SingleProductInfo";


export const Routing = () => {
  const adminDefaultPath = "/admin/dashboard";
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route
        path="/products/:productId/variants/:variantId/:selectedProduct"
        element={<ProductDetails path={"/"} />}
      />
      <Route path="/reset/password" element={<ResetPassword />} />
      <Route path="/reset/password/:token" element={<ResetPassword />} />
      <Route path="/signin" element={<SignInOrSignUp title={"Sign In"} />} />
      <Route path="/signup" element={<SignInOrSignUp title={"Sign Up"} />} />

      {/*  user protected routes begins */}
      {isLoggedIn && (
        <>
          <Route path="/cart" element={<Cart/>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:token" element={<Profile />} />
        </>
      )}
      {/*  user protected routes ends */}

      {/* admin protected routes begins */}
      {isLoggedIn && user?.role === "admin" && (
        <>
          <Route path={`${adminDefaultPath}/home`} element={<Dashboard />} />
          <Route path={`${adminDefaultPath}/users`} element={<Users />} />
          <Route
            path={`${adminDefaultPath}/orders/:status`}
            element={<UserOrders />}
          />
          <Route
            path={`${adminDefaultPath}/categories`}
            element={<Categories/>}
          />
          <Route
            path={`${adminDefaultPath}/categories/:category/:id`}
            element={<SubCateogries/>}
          />
          <Route
            path={`${adminDefaultPath}/categories/:category/:id/:subcategory/:subId`}
            element={<Attributes/>}
          />
          <Route
            path={`${adminDefaultPath}/products`}
            element={<AllProducts />}
          />
          <Route
            path={`${adminDefaultPath}/products/:id`}
            element={
              <SingleProductInfo
                path={"/admin/dashboard/products"}
              />
            }
          />
        </>
      )}
      {/* admin routes ends */}

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};
