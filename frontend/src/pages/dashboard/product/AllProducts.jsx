import { Link } from "react-router";
import { TitleWithSearchBar } from "../../../components/Headers/TitleWithSearchBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteProduct,
  getAllProduct,
} from "../../../store/thunks/adminThunks";
import { useToastNotify } from "../../../hooks/useToastNotify";
import {
  clearAdminError,
  clearAdminMessage,
} from "../../../store/slices/adminSlice";
import { ProductModal } from "../../../components/modal/ProductModal";
import { BaseProductCard } from "../../../components/cards/BaseProductCard";

export const AllProducts = () => {
  const adminDefaultPath = "/admin/dashboard";

  const dispatch = useDispatch();
  const { loading, error, success, message,updated, products } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAllProduct());
  }, []);

  useEffect(() => {
   if(updated){
     dispatch(getAllProduct());
   }
  }, [updated]);

  useToastNotify(
    error,
    success,
    message,
    clearAdminError,
    clearAdminMessage,
    dispatch
  );

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div className="h-full relative grid grid-rows-[1fr_10fr_1fr] gap-y-3">
      <TitleWithSearchBar
        title={"Products"}
        placeholderValue={"search any product..."}
        path="/admin/dashboard/products"
      />

      <div className="h-full overflow-y-auto p-1">
        <div className="grid grid-cols-2 gap-3">
          {loading &&
            [1, 2, 3, 4].map((item, index) => {
              return (
                <div key={index} className="relative">
                  <BaseProductCard />
                </div>
              );
            })}

          {!loading &&
            products?.length > 0 &&
            products?.map((product) => {
              return (
                <Link
                  to={`${adminDefaultPath}/products/${product._id}`}
                  key={product._id}
                >
                  <BaseProductCard product={product} />
                </Link>
              );
            })}
        </div>

        {!loading && products?.length === 0 && (
          <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            No Products Yet
          </p>
        )}
      </div>

      <ProductModal />
    </div>
  );
};
