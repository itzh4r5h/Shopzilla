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
import { useEffect, useState } from "react";
import { getProductDetails } from "../../store/thunks/productThunks";

export const CartCard = ({
  variant,
  colorIndex,
  sizeIndex,
  productQuantity,
}) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = () => {
    if (variant.needSize) {
      dispatch(
        addProductToCartOrUpdateQuantity({
          id: variant._id,
          cartData: {
            quantity: getValues("quantity"),
            sizeIndex,
            colorIndex,
          },
        })
      );
    } else {
      dispatch(
        addProductToCartOrUpdateQuantity({
          id: variant._id,
          cartData: { quantity: getValues("quantity"), colorIndex },
        })
      );
    }
  };

  const { getValues, control } = useForm({
    defaultValues: {
      quantity: productQuantity,
    },
  });

  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (variant) {
      if (variant.needSize) {
        setStock(variant.images[colorIndex].sizes[sizeIndex].stock);
      } else {
        setStock(variant.images[colorIndex].stock);
      }
    }
  }, [variant]);

  return variant ? (
    <article className="w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 grid grid-cols-[2.5fr_4fr] gap-2">
      {/* product image begins */}
      <picture className="w-full h-35 block relative overflow-hidden">
        <ImageCard src={variant.images[colorIndex].files[0]} />
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p className="line-clamp-2 text-md my-2 capitalize">
          {variant.product.name}
        </p>
        {/* product name ends */}

        {/* price and rating container begins */}
        <div className="grid grid-cols-[2fr_2fr] items-center">
          {/* svg and price container begins */}
          <div className="w-full relative">
            {/* svg begins */}
            <svg
              className="w-full"
              height="40"
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
              className="absolute flex justify-center items-center w-fit top-1/2 -translate-y-1/2
                left-1"
            >
              <BsCurrencyRupee className="text-sm" />
              <span className="text-sm">
                {variant.images[colorIndex].price}
              </span>
            </div>
            {/* price ends */}
          </div>
          {/* svg and price container emd */}

          {/* rating begins */}
          <div className="flex justify-center items-center gap-1">
            <FaStar className="text-sm text-[var(--purpleDark)]" />
            <span className="text-sm text-[var(--purpleDark)] font-bold">
              {variant.product.ratings}
            </span>
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}

        {/*increase/decrease quanity and remove from cart begins */}
        <div className="grid grid-cols-[3fr_2fr] items-center mt-2">
          {stock >= productQuantity ? (
            <NormalSelect
              name="quantity"
              optionsData={Array.from(
                {
                  length: variant.needSize
                    ? variant.images[colorIndex].sizes[sizeIndex].stock
                    : variant.images[colorIndex].stock,
                },
                (_, i) => i + 1
              )}
              control={control}
              center={true}
              updateFunction={handleUpdateQuantity}
            />
          ) : (
            <p className="text-red-600 font-bold text-xl">Out of Stock</p>
          )}

          <FaTimesCircle
            className="justify-self-center text-2xl active:text-[var(--purpleDark)] transition-colors"
            onClick={() => dispatch(removeProductFromCart({id:variant._id,colorIndex}))}
          />
        </div>
        {/*increase/decrease quanity and remove from cart begins */}

        {variant.needSize && (
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-[var(--light)] uppercase text-sm">Size</h1>
            <h1 className="text-[var(--light)] uppercase text-sm">
              {variant.images[colorIndex].sizes[sizeIndex].size}
            </h1>
          </div>
        )}
      </div>
    </article>
  ) : (
    <article className="w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 grid grid-cols-[2.5fr_4fr] gap-2">
      {/* product image begins */}
      <picture className="w-full h-35 block relative overflow-hidden">
        <Skeleton height={"100%"} style={{ scale: 1.1 }} />
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p className="line-clamp-2 text-md my-2 capitalize">
          <Skeleton />
        </p>

        {/* product name ends */}

        {/* price and rating container begins */}
        <div className="grid grid-cols-[2fr_2fr] items-center">
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
        <div className="grid grid-cols-[3fr_2fr] items-center gap-5 mt-2">
          <Skeleton height={40} />

          <Skeleton height={30} width={30} />
        </div>
        {/*increase/decrease quanity and remove from cart begins */}
      </div>
    </article>
  );
};
