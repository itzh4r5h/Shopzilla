import { Link } from "react-router";
import { ProductCard } from "../../components/cards/ProductCard";
import { TitleWithSearchBar } from "../../components/Headers/TitleWithSearchBar";
import { useDispatch, useSelector } from "react-redux";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { getAllProducts } from "../../store/thunks/productThunks";
import { DeleteModal } from "../../components/modal/DeleteModal";
import { MdEditSquare } from "react-icons/md";
import { deleteProduct } from "../../store/thunks/adminThunks";
import { toast } from "react-toastify";
import { clearErrors, clearMessage } from "../../store/slices/adminSlice";
import { saveKeyword } from "../../store/slices/productSlice";

export const AllProducts = () => {
  const adminDefaultPath = "/admin/dashboard";

  const dispatch = useDispatch();
  const {
    loading: productsLoading,
    products,
    keyword,
  } = useSelector((state) => state.products);
  const {
    loading: adminLoading,
    error,
    success,
    message,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(saveKeyword(''))
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    dispatch(getAllProducts(keyword));
  }, [keyword]);

  useEffect(() => {
    // this shows the error if error exists
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  // show the success message when both success and message are defined
  useEffect(() => {
    if (success && message) {
      dispatch(getAllProducts());
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div className="h-full relative">
      <TitleWithSearchBar
        title={"Products"}
        placeholderValue={"search any product..."}
        path="/admin/dashboard/products"
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        {(productsLoading || adminLoading) &&
          [1, 2, 3, 4].map((item, index) => {
            return (
              <div key={index} className="relative">
                <ProductCard />

                <span className="absolute -top-1 -right-1 z-100">
                  <button className="rounded-sm border w-11 h-6 overflow-hidden">
                    <Skeleton
                      height={"100%"}
                      width={"100%"}
                      style={{ lineHeight: "initial" }}
                    />
                  </button>
                </span>
              </div>
            );
          })}

        {!productsLoading &&
          !adminLoading &&
          products?.length > 0 &&
          products?.map((product) => {
            return (
              <div key={product._id} className="relative">
                <Link to={`${adminDefaultPath}/products/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
                <Link
                  to={`${adminDefaultPath}/products/${product._id}/update`}
                  className="absolute -top-1 -right-1 cursor-pointer"
                >
                  <span className="bg-[var(--purpleDark)] h-7 w-7 grid place-content-center rounded-md">
                    <MdEditSquare className="text-xl text-white" />
                  </span>
                </Link>

                <span className="absolute top-8 -right-1">
                  <DeleteModal
                    classes={"text-2xl text-white"}
                    spanClasses={
                      "bg-[var(--purpleDark)] h-7 w-7 grid place-content-center rounded-md"
                    }
                    deleteFunction={() => handleDeleteProduct(product._id)}
                  />
                </span>
              </div>
            );
          })}
      </div>

      {(!productsLoading || !adminLoading) && products?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Products Yet
        </p>
      )}
    </div>
  );
};
