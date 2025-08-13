import { ProductCard } from "../components/cards/ProductCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../store/thunks/productThunks";

export const Home = () => {
  const dispatch = useDispatch();
  const { error, products, productsCount, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  return (
    <div className="h-full relative">
      <div className="grid grid-cols-2 gap-3">
        {loading &&
          [...Array(20)].map((item, index) => {
            return <ProductCard key={index} />;
          })}

        {!loading &&
          products?.length > 0 &&
          products?.map((product) => {
            return (
              <Link to={`/products/${product._id}`} key={product._id}>
                <ProductCard product={product} />
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
  );
};
