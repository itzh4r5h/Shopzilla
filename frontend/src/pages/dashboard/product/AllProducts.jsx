import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProduct } from "../../../store/thunks/admin/adminProductThunk";
import { saveKeyword, setPage } from "../../../store/slices/admin/adminProductSlice";
import { BaseProductCard } from "../../../components/cards/BaseProductCard";
import { PurplePagination } from "../../../components/common/PurplePagination";

export const AllProducts = () => {
  const adminDefaultPath = "/admin/dashboard";

  const dispatch = useDispatch();
  const { loading, updated, products,page,keyword,totalPages } = useSelector(
    (state) => state.adminProduct
  );

  useEffect(() => {
    dispatch(getAllProduct({page,keyword}));
  }, [page,keyword]);


  useEffect(()=>{
    dispatch(saveKeyword(""))
    dispatch(setPage(1))
  },[])

  useEffect(() => {
    if (updated) {
      dispatch(getAllProduct({page,keyword}));
    }
  }, [updated]);

  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-2 gap-3 h-full">
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
            <PurplePagination count={totalPages} setPage={setPage} />
          </div>
        )}
      </div>

      {!loading && products?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Products Yet
        </p>
      )}
    </div>
  );
};
