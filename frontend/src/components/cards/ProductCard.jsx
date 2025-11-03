import { BsCurrencyRupee } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ImageCard } from "./ImageCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRatings } from "../../store/thunks/non_admin/reviewThunk";
import { UpdateStock } from "../modal/UpdateStock";
import { formatINR } from "../../utils/helpers";

export const ProductCard = ({
  variant,
  orderDetails = false,
  productId = undefined,
  out_of_stock = false
}) => {
  const dispatch = useDispatch();
  const { ratings } = useSelector((state) => state.review);


  useEffect(() => {
    if (orderDetails && productId) {
      dispatch(getRatings(productId));
    }
  }, [orderDetails, productId]);


  return variant ? (
    <article
      className={`w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 ${
        orderDetails ? "" : "pb-1"
      }`}
    >
      {/* product image begins */}
      <picture
        className={`w-full ${
          orderDetails ? "h-45" : "h-35"
        } block relative overflow-hidden`}
      >
        {orderDetails ? (
          <ImageCard src={{ url: variant.image, name: variant.name }} />
        ) : (
          <ImageCard src={variant.images[variant.selectedProduct].files[0]} />
        )}
      </picture>
      {/* product image ends */}

      <div>
        {/* product name begins */}
        <p
          className={`${
            orderDetails ? "text-lg" : "line-clamp-1"
          } text-md capitalize my-1`}
        >
          {orderDetails?variant.name:variant.product.name}
        </p>
        {/* product name ends */}

         {orderDetails && variant.needSize && <p
          className="text-md capitalize mb-1"
        >
          size <span className="uppercase">{variant.size}</span>
        </p>}

        {/* price and rating container begins */}
        <div
          className={`grid ${
            orderDetails ? "grid-cols-[2fr_2fr]" : "grid-cols-[2fr_1fr]"
          } items-center`}
        >
          {/* svg and price container begins */}
          {!out_of_stock && <div className="w-full relative">
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
                {orderDetails?formatINR(variant.price):formatINR(variant.images[variant.selectedProduct].price)}
              </span>
            </div>
            {/* price ends */}
          </div>}
          {/* svg and price container emd */}

          {out_of_stock && variant.needSize && <p className="col-span-2 text-[var(--light)] mb-0.5">sizes - {variant.images[variant.selectedProduct].sizes.filter((sz)=>sz.stock===0).length}</p>}
          {out_of_stock && <UpdateStock variant={variant}/>}

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
              {orderDetails ? ratings : variant.product.ratings}
            </span>
          </div>
          {/* rating ends */}
        </div>
        {/* price and rating container ends */}
      </div>
    </article>
  ) : (
    <article
      className={`w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 ${
        orderDetails ? "" : "pb-1"
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
            orderDetails ? "text-lg" : "line-clamp-1"
          } text-md my-2`}
        >
          <Skeleton />
        </p>

        {/* product name ends */}

        {/* price and rating container begins */}
        <div
          className={`grid ${
            orderDetails ? "grid-cols-[2fr_2fr]" : "grid-cols-[2fr_1fr]"
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
