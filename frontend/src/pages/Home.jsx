import { ProductCard } from "../components/cards/ProductCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../store/thunks/productThunks";

export const Home = () => {
  const dispatch = useDispatch();
  const { error, products, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {products
        ? products.map((product) => {
            return (
              <Link to={`/products/${product._id}`} key={product._id}>
                <ProductCard product={product} />
              </Link>
            );
          })
        : [...Array(20)].map((item, index) => {
            return <ProductCard key={index} />;
          })}
    </div>
  );
};
