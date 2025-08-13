import { ProductCard } from "../components/cards/ProductCard";
import { PriceCard } from "../components/cards/PriceCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllCartProducts,
} from "../store/thunks/cartThunk";
import {
  clearErrors as clearCartErrors,
  clearMessage,
  quantityUpdated,
} from "../store/slices/cartSlice";
import { getAllAddress } from "../store/thunks/userThunks";
import { ShippingAddressCard } from "../components/cards/ShippingAddressCard";

export const Cart = ({ mainRef }) => {
  const dispatch = useDispatch();

  const {
    success,
    message,
    error,
    cartProducts,
    cartProductsQuantity,
    totalPrice,
    loading,
    updated,
  } = useSelector((state) => state.cart);


  
  useEffect(() => {
    dispatch(getAllCartProducts());
    dispatch(getAllAddress());

    mainRef.current.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllCartProducts());
    }
  }, [updated]);


  useEffect(() => {
    // this shows the error if error exists
    if (error) {
      toast.error(error);
      dispatch(clearCartErrors());
    }
  }, [error]);

  useEffect(() => {
    // this shows the error if error exists
    if (success && message) {
      dispatch(quantityUpdated());
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);

  return (
    <div className="w-full h-full relative">
      <h1 className="text-center text-3xl font-bold p-2">My Cart</h1>

      {cartProducts?.length > 0 ? (
        <>
          <ShippingAddressCard/>

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
          <div className="mt-4">
            <PriceCard
              quanity={cartProductsQuantity}
              price={totalPrice}
            />
          </div>
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
