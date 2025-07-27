import { Route, Routes } from "react-router";
import { Home } from "../pages/Home";
import { Cart } from "../pages/Cart";
import { Profile } from "../pages/Profile";
import { NotFound } from "../pages/NotFound";
import { ProductDetails } from "../pages/ProductDetails";
import { Orders } from "../pages/Orders";
import { OrderDetails } from "../pages/OrderDetails";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Users } from "../pages/dashboard/Users";
import { UserOrders } from "../pages/dashboard/UserOrders";
import { AllProducts } from "../pages/dashboard/AllProducts";
import { AddOrEditProduct } from "../pages/dashboard/AddOrEditProduct";
import { ResetPassword } from "../pages/ResetPassword";
import { SignInOrSignUp } from "../pages/SignInOrSignUp";
import { Products } from "../pages/Products";
import { useSelector } from "react-redux";

export const Routing = ({ mainRef }) => {
  const adminDefaultPath = "/admin/dashboard";
  const { isLoggedIn, user } = useSelector((state) => state.user);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route
        path="/products/:id"
        element={<ProductDetails path={"/"} mainRef={mainRef} />}
      />
      <Route path="/reset/password" element={<ResetPassword />} />
      <Route path="/reset/password/:token" element={<ResetPassword />} />
      <Route path="/signin" element={<SignInOrSignUp title={"Sign In"} />} />
      <Route path="/signup" element={<SignInOrSignUp title={"Sign Up"} />} />

      {/*  user protected routes begins */}
      {isLoggedIn && (
        <>
          <Route path="/cart" element={<Cart />} />
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
            path={`${adminDefaultPath}/product/new`}
            element={<AddOrEditProduct name="Add New" />}
          />
          <Route
            path={`${adminDefaultPath}/products`}
            element={<AllProducts />}
          />
          <Route
            path={`${adminDefaultPath}/products/:id/update`}
            element={<AddOrEditProduct edit={true} name="Update" />}
          />
          <Route
            path={`${adminDefaultPath}/products/:id`}
            element={
              <ProductDetails
                path={"/admin/dashboard/products"}
                mainRef={mainRef}
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
