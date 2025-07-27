import { ProductCard } from "../components/cards/ProductCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../store/thunks/productThunks";
import { Heading } from "../components/Headers/Heading";

export const Products = () => {
  const dispatch = useDispatch();
  const { error, products, keyword, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllProducts(keyword));
  }, [keyword]);

  return (
    <div>
      <Heading name={"Products"} path={'/'} />

      <div className="grid grid-cols-2 gap-3 mt-5">
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
    </div>
  );
};
