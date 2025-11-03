import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { PurplePagination } from "../../../components/common/PurplePagination";
import { getOutOfStockVariants } from "../../../store/thunks/admin/variantThunk";
import { setKeyword, setPage } from "../../../store/slices/admin/variantSlice";
import { ProductCard } from "../../../components/cards/ProductCard";

export const AllOutOfStockProducts = () => {

  const dispatch = useDispatch();
  const { loading, updated, out_of_stock_variants, page, keyword, totalPages } =
    useSelector((state) => state.variant);

  useEffect(() => {
    dispatch(getOutOfStockVariants({ page, keyword }));
  }, [page, keyword]);

  useEffect(() => {
    dispatch(setKeyword(""));
    dispatch(setPage(1));
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getOutOfStockVariants({ page, keyword }));
    }
  }, [updated]);

  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-2 gap-3 h-full">
        {loading &&
          [1, 2, 3, 4].map((item, index) => {
            return (
              <div key={index} className="relative">
                <ProductCard />
              </div>
            );
          })}

        {!loading &&
          out_of_stock_variants?.length > 0 &&
          out_of_stock_variants?.map((variant, index) => {
            return (
              <div className="h-fit" key={variant._id + index}>
                <ProductCard variant={variant} out_of_stock={true} />
              </div>
            );
          })}

        {out_of_stock_variants?.length > 0 && (
          <div className="flex justify-center items-end col-span-2">
            <PurplePagination count={totalPages} setPage={setPage} page={page}/>
          </div>
        )}
      </div>

      {!loading && out_of_stock_variants?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4">
          No out of stock products exists
        </p>
      )}
    </div>
  );
};
