import { ProductCard } from "../components/cards/ProductCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../store/thunks/non_admin/productThunk";
import { PurplePagination } from "../components/common/PurplePagination";
import { setPage } from "../store/slices/non_admin/productSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const { variants, totalPages, loading, page } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAllProducts({ page, keyword: "" }));
  }, [page]);

  return (
    <div className="h-full relative">
      <div className="grid grid-cols-2 gap-3 h-full">
        {loading &&
          [...Array(20)].map((item, index) => {
            return <ProductCard key={index} />;
          })}

        {!loading &&
          variants?.length > 0 &&
          variants?.map((variant, index) => {
            return (
              <Link
                className="h-fit"
                to={`/products/${variant.product._id}/variants/${variant._id}/${variant.selectedProduct}`}
                key={variant._id + index}
              >
                <ProductCard variant={variant} />
              </Link>
            );
          })}

        {variants?.length > 0 && (
          <div className="flex justify-center items-end col-span-2">
            <PurplePagination
              count={totalPages}
              setPage={setPage}
              page={page}
            />
          </div>
        )}
      </div>

      {!loading && variants?.length < 1 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Products Yet
        </p>
      )}
    </div>
  );
};
