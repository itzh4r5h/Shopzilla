import { Link } from "react-router";
import { ProductCard } from "../../components/cards/ProductCard";
import { TitleWithSearchBar } from "../../components/Headers/TitleWithSearchBar";
import { useDispatch, useSelector } from "react-redux";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { getAllProducts } from "../../store/thunks/productThunks";

export const AllProducts = () => {
  const adminDefaultPath = '/admin/dashboard'

  const dispatch = useDispatch()
  const {loading, products} = useSelector((state)=>state.products)

  useEffect(()=>{
    dispatch(getAllProducts())
  },[])

  return (
    <div className="h-full relative">
      <TitleWithSearchBar
        title={"Products"}
        placeholderValue={"search any product..."}
      />

      <div className="grid grid-cols-2 gap-5 mt-4">
        {loading && [1, 2, 3, 4].map((item, index) => {
          return (
            <div key={index} className="relative">
             
                <ProductCard />
             
             <span className="absolute -top-1 -right-1 z-100">
              <button className="rounded-sm border w-11 h-6 overflow-hidden">
                 <Skeleton height={'100%'} width={'100%'} style={{lineHeight: 'initial'}}/>
              </button>
             </span>
            </div>
          );
        })}

        {!loading && products?.length !== 0 && products?.map((product, index) => {
          return (
            <div key={index} className="relative">
              <Link to={`${adminDefaultPath}/products/${index}`}>
                <ProductCard />
              </Link>
             <Link to={`${adminDefaultPath}/products/${index}/update`} className="absolute -top-1 -right-1 z-100">
              <button className="bg-[var(--purpleDark)] text-white text-sm px-2 py-0.5 rounded-sm">
                Edit
              </button>
             </Link>
            </div>
          );
        })}

      </div>

     {!loading && products?.length === 0 && <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">No Products Yet</p>}
    </div>
  );
};
