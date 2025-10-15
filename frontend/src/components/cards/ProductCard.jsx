import { BsCurrencyRupee } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ImageCard } from "./ImageCard";
import { NormalSelect } from "../selectors/NormalSelect";
import { useForm } from "react-hook-form";
import {
  addProductToCartOrUpdateQuantity,
  removeProductFromCart,
} from "../../store/thunks/cartThunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProductDetails } from "../../store/thunks/productThunks";

export const ProductCard = ({
  variant,
  cart = false,
  productQuantity = null,
  orderDetails = false,
}) => {
  const dispatch = useDispatch();
  const { variant: productRating } = useSelector((state) => state.products);

  const handleUpdateQuantity = () => {
    dispatch(
      addProductToCartOrUpdateQuantity({
        id: variant._id,
        quantity: getValues("quantity"),
      })
    );
  };

  useEffect(() => {
    if (orderDetails && variant) {
      dispatch(getProductDetails(variant.id));
    }
  }, [orderDetails, variant]);

  const { register, setValue, getValues,control } = useForm({defaultValues:{
    quantity: 1,
  }});

  return variant ? (
    <article
      className={`w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 ${
        cart ? "grid grid-cols-[2.5fr_4fr] gap-2" : orderDetails ? "" : "pb-1"
      }`}
    >
      {/* product image begins */}
      <picture
        className={`w-full ${
          orderDetails ? "h-45" : "h-35"
        } block relative overflow-hidden`}
      >
        {orderDetails ? (
          <ImageCard src={{ url: variant.images, name: variant.name }} />
        ) : (
          <ImageCard src={variant.images[variant.selectedProduct].files[0]} />
        )}
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p
          className={`${
            cart ? "line-clamp-2" : orderDetails ? "text-lg" : "line-clamp-1"
          } text-md my-2 capitalize`}
        >
          {variant.product.name}
        </p>

        {/* product name ends */}

        {/* price and rating container begins */}
        <div
          className={`grid ${
            cart || orderDetails ? "grid-cols-[2fr_2fr]" : "grid-cols-[2fr_1fr]"
          } items-center`}
        >
          {/* svg and price container begins */}
          <div className="w-full relative">
            {/* svg begins */}
            <svg
              className="w-full"
              height={`${orderDetails ? "50" : "40"}`}
              viewBox="0 0 200 60"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                d="M0 5C0 2.2 2.2 0 5 0H195L150 30L195 60H5C2.2 60 0 57.8 0 55V5Z"
                fill="var(--purple)"
                stroke="var(--black)"
                strokeWidth="1"
                strokeLinejoin="miter"
              />
            </svg>
            {/* svg ends */}

            {/* price begins */}
            <div
              className={`absolute flex justify-center items-center w-fit top-1/2 -translate-y-1/2 ${
                orderDetails ? "left-6" : "left-1"
              }`}
            >
              <BsCurrencyRupee
                className={orderDetails ? "text-lg" : "text-sm"}
              />
              <span
                className={`${orderDetails ? "text-lg font-bold" : "text-sm"}`}
              >
                {variant.images[variant.selectedProduct].price}
              </span>
            </div>
            {/* price ends */}
          </div>
          {/* svg and price container emd */}

          {/* rating begins */}
          <div className="flex justify-center items-center gap-1">
            <FaStar
              className={`${
                orderDetails ? "text-xl" : "text-sm"
              } text-[var(--purpleDark)]`}
            />
            <span
              className={`${
                orderDetails ? "text-xl" : "text-sm"
              } text-[var(--purpleDark)] font-bold`}
            >
              {orderDetails ? productRating?.ratings : variant.product.ratings}
            </span>
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}

        {/*increase/decrease quanity and remove from cart begins */}
        {cart && (
          <div className="grid grid-cols-[3fr_2fr] items-center mt-2">
            {variant.stock >= productQuantity ? (
              <NormalSelect
                name="quantity"
                optionsData={Array.from(
                  { length: variant.stock },
                  (_, i) => i + 1
                )}
                control={control}
                updateFunction={handleUpdateQuantity}
              />
            ) : (
              <p className="text-red-600 font-bold text-xl">Out of Stock</p>
            )}

            <FaTimesCircle
              className="justify-self-center text-2xl active:text-[var(--purpleDark)] transition-colors"
              onClick={() => dispatch(removeProductFromCart(variant._id))}
            />
          </div>
        )}
        {/*increase/decrease quanity and remove from cart begins */}
      </div>
    </article>
  ) : (
    <article
      className={`w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 ${
        cart ? "grid grid-cols-[2.5fr_4fr] gap-2" : orderDetails ? "" : "pb-1"
      }`}
    >
      {/* product image begins */}
      <picture
        className={`w-full ${orderDetails ? "h-55" : "h-35"} block relative`}
      >
        <Skeleton height={"100%"} />
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p
          className={`${
            cart ? "line-clamp-2" : orderDetails ? "text-lg" : "line-clamp-1"
          } text-md my-2`}
        >
          <Skeleton />
        </p>

        {/* product name ends */}

        {/* price and rating container begins */}
        <div
          className={`grid ${
            cart || orderDetails ? "grid-cols-[2fr_2fr]" : "grid-cols-[2fr_1fr]"
          } items-center`}
        >
          <Skeleton />

          {/* svg and price container emd */}

          {/* rating begins */}
          <div className="flex justify-center items-center gap-1">
            <Skeleton height={15} width={30} />
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}

        {/*increase/decrease quanity and remove from cart begins */}
        {cart && (
          <div className="grid grid-cols-[3fr_2fr] items-center mt-2">
            <div className="grid grid-cols-3 items-center justify-items-center">
              <FaPlusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />

              <span className="text-xl font-bold">{productQuantity}</span>

              <FaMinusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
            </div>

            <FaTimesCircle className="justify-self-center text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </div>
        )}
        {/*increase/decrease quanity and remove from cart begins */}

        {/* rate your exprience and return product begins */}
        {orderDetails && (
          <div className="grid grid-cols-1 grid-rows-2 place-content-center gap-2 mt-4">
            <Skeleton />
            <Skeleton />
          </div>
        )}
        {/* rate your exprience and return product ends */}
      </div>
    </article>
  );
};
