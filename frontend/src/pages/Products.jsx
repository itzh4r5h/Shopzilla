import { ProductCard } from "../components/cards/ProductCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts, getFilters } from "../store/thunks/non_admin/productThunk";
import { Heading } from "../components/Headers/Heading";
import { ProudctFilter } from "../components/Filters/ProudctFilter";
import { PurplePagination } from "../components/common/PurplePagination";
import { setPage } from "../store/slices/non_admin/productSlice";

export const Products = () => {
  const dispatch = useDispatch();
  const { variants, keyword, totalPages, filters, attributes, page } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts({ page, keyword }));
  }, [page, keyword]);


  useEffect(()=>{
    if(keyword!==''){
      dispatch(getFilters(keyword))
    }
  },[keyword])


  useEffect(()=>{
    dispatch(setPage(1))
  },[])

  return (
    <div className="relative h-full grid grid-rows-[1fr_11fr]">
      <Heading
        name={"Products"}
        path={"/"}
        icon={keyword.length > 0 && attributes?.length > 0 ? true : false}
        iconComponent={
          <ProudctFilter
            filters={filters}
            attributes={attributes}
            keyword={keyword}
            page={page}
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 mt-5 overflow-y-auto">
        {variants ? (
          variants.length > 0 ? (
            variants.map((variant, index) => {
              return (
                <Link
                  to={`/products/${variant.product._id}/variants/${variant._id}/${variant.selectedProduct}`}
                  key={variant._id + index}
                  className="h-fit"
                >
                  <ProductCard variant={variant} />
                </Link>
              );
            })
          ) : (
            <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4">
              Oops! nothing found with this name - "{keyword}"
            </p>
          )
        ) : (
          [...Array(20)].map((item, index) => {
            return <ProductCard key={index} />;
          })
        )}

       {variants?.length > 0 &&  <div className="flex justify-center items-end col-span-2">
          <PurplePagination count={totalPages} setPage={setPage}/>
        </div>}
      </div>
    </div>
  );
};
