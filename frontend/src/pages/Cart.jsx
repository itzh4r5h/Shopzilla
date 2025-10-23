import { PriceCard } from "../components/cards/PriceCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCartProducts } from "../store/thunks/non_admin/cartThunk";
import { ShippingAddressSelector } from "../components/selectors/ShippingAddressSelector";
import { CartCard } from "../components/cards/CartCard";

export const Cart = () => {
  const dispatch = useDispatch();

  const {
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

  return (
    <div className="w-full h-full relative">
      <h1 className="text-center text-3xl font-bold p-2">My Cart</h1>

      {cartProducts?.length > 0 ? (
        <>
          <ShippingAddressSelector />

          {/* cart items begins */}
          <div className="grid mt-4 gap-4 items-center justify-items-center">
            {cartProducts?.map((cartProduct,index) => {
              return (
                <CartCard
                  key={cartProduct.variant._id+index}
                  productQuantity={cartProduct.quantity}
                  variant={cartProduct.variant}
                  colorIndex={cartProduct.colorIndex}
                  sizeIndex={
                    cartProduct.variant.needSize ? cartProduct.sizeIndex : null
                  }
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
