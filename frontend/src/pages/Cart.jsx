import { ProductCard } from "../components/cards/ProductCard";
import { PriceCard } from "../components/cards/PriceCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCartProducts } from "../store/thunks/cartThunk";
import { clearCartError, clearCartMessage } from "../store/slices/cartSlice";
import { ShippingAddressCard } from "../components/cards/ShippingAddressCard";
import { useToastNotify } from "../hooks/useToastNotify";

export const Cart = () => {
  const dispatch = useDispatch();

  const {
    success,
    message,
    error,
    cartProducts,
    cartProductsQuantity,
    totalPrice,
    updated,
  } = useSelector((state) => state.cart);

  useEffect(() => {
      dispatch(getAllCartProducts());
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllCartProducts());
    }
  }, [updated]);

  useToastNotify(error, success, message, clearCartError, clearCartMessage,dispatch);

  return (
    <div className="w-full h-full relative">
      <h1 className="text-center text-3xl font-bold p-2">My Cart</h1>

      {cartProducts?.length > 0 ? (
        <>
          <ShippingAddressCard />

          {/* cart items begins */}
          <div className="grid mt-4 gap-4 items-center justify-items-center">
            {cartProducts?.map((cartProduct) => {
              return (
                <ProductCard
                  key={cartProduct.product._id}
                  productQuantity={cartProduct.quantity}
                  cart={true}
                  product={cartProduct.product}
                />
              );
            })}
          </div>
          {/* cart items ends */}

          {/* price details begins */}
          {totalPrice > 0 && (
            <div className="mt-4">
              <PriceCard quanity={cartProductsQuantity} price={totalPrice} />
            </div>
          )}
          {/* price details ends */}
        </>
      ) : (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Your cart is empty
        </p>
      )}
    </div>
  );
};
