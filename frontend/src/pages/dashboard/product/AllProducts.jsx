import { Link } from "react-router";
import { TitleWithSearchBar } from "../../../components/Headers/TitleWithSearchBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProduct } from "../../../store/thunks/admin/adminProductThunk";
import { setPage } from "../../../store/slices/admin/adminProductSlice";
import { ProductModal } from "../../../components/modal/ProductModal";
import { BaseProductCard } from "../../../components/cards/BaseProductCard";
import { PurplePagination } from "../../../components/common/PurplePagination";

export const AllProducts = () => {
  const adminDefaultPath = "/admin/dashboard";

  const dispatch = useDispatch();
  const { loading, updated, products } = useSelector((state) => state.adminProduct);

  useEffect(() => {
    dispatch(getAllProduct());
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllProduct());
    }
  }, [updated]);

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

          {products?.length > 0 && (
            <div className="flex justify-center items-end col-span-2">
              <PurplePagination count={5} setPage={setPage} />
            </div>
          )}
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
