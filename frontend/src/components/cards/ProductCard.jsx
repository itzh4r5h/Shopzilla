import { BsCurrencyRupee } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ImageCard } from "./ImageCard";

export const ProductCard = ({
  product,
  cart = false,
  quantity = null,
  orderDetails = false,
}) => {
  return product ? (
    <article
      className={`w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 ${
        cart ? "grid grid-cols-[2.5fr_4fr] gap-2" : orderDetails ? "" : "pb-1"
      }`}
    >
      {/* product image begins */}
      <picture
        className={`w-full ${orderDetails ? "h-55" : "h-35"} block relative`}
      >
        <ImageCard src={product.images[0]} />
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p
          className={`${
            cart ? "line-clamp-2" : orderDetails ? "text-lg" : "line-clamp-1"
          } text-md my-2`}
        >
          {product.name}
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
              className={`absolute flex justify-center items-center w-fit top-1/2 -translate-y-1/2 ${
                orderDetails ? "left-6" : "left-1"
              }`}
            >
              <BsCurrencyRupee className="text-sm" />
              <span
                className={`${orderDetails ? "text-lg font-bold" : "text-sm"}`}
              >
                {product.price}
              </span>
            </div>
            {/* price ends */}
          </div>
          {/* svg and price container emd */}

          {/* rating begins */}
          <div className="flex justify-center items-center gap-1">
            <FaStar className="text-sm text-[var(--purpleDark)]" />
            <span className="text-sm text-[var(--purpleDark)] font-bold">
              {product.ratings}
            </span>
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}

        {/*increase/decrease quanity and remove from cart begins */}
        {cart && (
          <div className="grid grid-cols-[3fr_2fr] items-center mt-2">
            <div className="grid grid-cols-3 items-center justify-items-center">
              <FaPlusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />

              <span className="text-xl font-bold">{quantity}</span>

              <FaMinusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
            </div>

            <FaTimesCircle className="justify-self-center text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </div>
        )}
        {/*increase/decrease quanity and remove from cart begins */}

        {/* rate your exprience and return product begins */}
        {orderDetails && (
          <div className="grid grid-cols-1 grid-rows-2 place-content-center gap-2 mt-4">
            <FillButton name={"Rate Your Experience"} />
            <OutlineButton name={"Return"} />
          </div>
        )}
        {/* rate your exprience and return product ends */}
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
        <Skeleton height={'100%'}/>
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p
          className={`${
            cart ? "line-clamp-2" : orderDetails ? "text-lg" : "line-clamp-1"
          } text-md my-2`}
        >
          <Skeleton/>
        </p>

        {/* product name ends */}

        {/* price and rating container begins */}
        <div
          className={`grid ${
            cart || orderDetails ? "grid-cols-[2fr_2fr]" : "grid-cols-[2fr_1fr]"
          } items-center`}
        >
          <Skeleton/>
      
          {/* svg and price container emd */}

          {/* rating begins */}
          <div className="flex justify-center items-center gap-1">
           <Skeleton height={15} width={30}/>
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}

        {/*increase/decrease quanity and remove from cart begins */}
        {cart && (
          <div className="grid grid-cols-[3fr_2fr] items-center mt-2">
            <div className="grid grid-cols-3 items-center justify-items-center">
              <FaPlusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />

              <span className="text-xl font-bold">{quantity}</span>

              <FaMinusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
            </div>

            <FaTimesCircle className="justify-self-center text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </div>
        )}
        {/*increase/decrease quanity and remove from cart begins */}

        {/* rate your exprience and return product begins */}
        {orderDetails && (
          <div className="grid grid-cols-1 grid-rows-2 place-content-center gap-2 mt-4">
            <Skeleton/>
           <Skeleton/>
          </div>
        )}
        {/* rate your exprience and return product ends */}
      </div>
    </article>
  );
};
