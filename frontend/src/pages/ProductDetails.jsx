import { BsCurrencyRupee } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { OutlineButton } from "../components/buttons/OutlineButton";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { Heading } from "../components/Headers/Heading";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../store/thunks/non_admin/productThunk";
import { useNavigate, useParams } from "react-router";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { ImageCard } from "../components/cards/ImageCard";
import { toast } from "react-toastify";
import {
  clearProductDetails,
} from "../store/slices/non_admin/productSlice";
import { ReviewModal } from "../components/modal/ReviewModal";
import { ReviewCard } from "../components/cards/ReviewCard";
import { addProductToCartOrUpdateQuantity } from "../store/thunks/non_admin/cartThunk";
import { ShippingAddressSelector } from "../components/selectors/ShippingAddressSelector";
import { Checkout } from "./Checkout";
import { getAllReviewsAndRatings } from "../store/thunks/non_admin/reviewThunk";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "var(--purpleDark)",
    ...theme.applyStyles("dark", {
      backgroundColor: "var(--purpleDark)",
    }),
  },
}));

export const ProductDetails = ({ path }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId, variantId, selectedProduct } = useParams();
  const {
    loading: productLoading,
    variant,
  } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const {
    reviewed,
    reviews,
    reviewsCount,
    allRatings,
    totalRatings,
    loading: reviewLoading,
  } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getProductDetails(variantId));
    dispatch(getAllReviewsAndRatings(productId));

    // this is used so that variant set to undefined when component is unmounted
    // it prevents the variant not to stuck on previous value
    return () => {
      dispatch(clearProductDetails());
    };
  }, []);

  useEffect(() => {
    if (reviewed) {
      dispatch(getAllReviewsAndRatings(productId));
      dispatch(getProductDetails(variantId));
    }
  }, [reviewed]);

  const ratingLabels = {
    0: "Not Rated Yet",
    1: "Very Bad",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  function abbreviateNumber(num) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  }

  const isReviewed = reviews?.find(
    (rev) => rev.user.toString() === user?._id.toString()
  );

  const [selectedColorIndex,setSelectedColorIndex] = useState(Number(selectedProduct))
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  // this will work as check
  const [totalStock, setTotalStock] = useState(0);
  // current stock of selected product
  const [currentStock, setCurrentStock] = useState(0);

  const updateStock = (clrIndex) => {
    if (variant) {
      if (variant.needSize) {
        const stocks = variant.images[clrIndex].sizes.map(
          (sizeObj) => sizeObj.stock
        );
        const totalStk = stocks.reduce((sum, stock) => sum + stock, 0);
        if (totalStk > 0) {
          // for setting up selectedSizeIndex based on stock is in-stock of that size
          for (let index = 0; index < stocks.length; index++) {
            if (stocks[index] > 0) {
              setSelectedSizeIndex(index);
              setCurrentStock(stocks[index]);
              break;
            }
          }
        }
        else{
          setCurrentStock(0)
        }
        setTotalStock(totalStk);
      } else {
        const stck = variant.images[selectedColorIndex].stock;
        setTotalStock(stck);
        setCurrentStock(stck);
      }
    }
  };

  // this is used to set the totalStock and currentStock based on needSize of variant
  useEffect(() => {
    updateStock(selectedColorIndex);
  }, [variant]);

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in");
      navigate("/signin");
    } else {
      if (variant.needSize) {
        dispatch(
          addProductToCartOrUpdateQuantity({
            id: variantId,
            cartData: {
              quantity,
              sizeIndex: selectedSizeIndex,
              colorIndex: selectedColorIndex,
            },
          })
        );
      } else {
        dispatch(
          addProductToCartOrUpdateQuantity({
            id: variantId,
            cartData: { quantity, colorIndex: selectedColorIndex },
          })
        );
      }
    }
  };

  return (
    <div>
      <Heading name={"Product Details"} path={path} />
      {!productLoading && !reviewLoading && allRatings && variant ? (
        <article className="w-full min-h-full border border-[var(--black)] bg-[var(--white)] p-2 flex flex-col gap-2 mt-5">
          <Swiper
            loop={
              variant.images[selectedColorIndex].files.length > 1
                ? true
                : false
            }
            pagination={{ clickable: true }}
            grabCursor={true}
            effect={"creative"}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: [0, 0, -400],
              },
              next: {
                translate: ["100%", 0, 0],
              },
            }}
            modules={[EffectCreative, Pagination]}
            className="mySwiper"
          >
            {variant.images[selectedColorIndex].files.map((img) => {
              return (
                <SwiperSlide key={img._id}>
                  <picture className="w-full h-55 block relative overflow-hidden bg-white">
                    <ImageCard src={img} />
                  </picture>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* product name begins */}
          <p className="line-clamp-3 text-xl capitalize">
            {variant.product.name}
          </p>
          {/* product name ends */}

          {/* color box begins */}
          <div className="overflow-x-auto flex gap-3 items-centers">
            {variant.images
              .map((img) => img.color)
              .map((clr, index) => {
                return (
                  <div
                    onClick={() => {
                      setSelectedColorIndex(index)
                      updateStock(index);
                      setQuantity(1);
                    }}
                    className={`h-9 w-9 border-2 rounded-full relative ${
                      selectedColorIndex === index
                        ? "border-[var(--purpleDark)]"
                        : "border-transparent"
                    }`}
                    key={index}
                  >
                    <div
                      className="h-7 w-7 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border"
                      style={{ backgroundColor: clr }}
                    ></div>
                  </div>
                );
              })}
          </div>
          {/* color box ends */}

          {/* size box begins */}
          {variant.needSize && totalStock > 0 && (
            <div className="overflow-x-auto flex gap-3 items-centers">
              {variant.images[selectedColorIndex].sizes
                .map((sizeObj) => sizeObj)
                .map((sz, index) => {
                  return (
                    <div
                      onClick={
                        sz.stock > 0
                          ? () => {
                              setSelectedSizeIndex(index);
                              setCurrentStock(sz.stock);
                              setQuantity(1);
                            }
                          : () => {}
                      }
                      className={`h-9 w-9 border-2 rounded-full relative ${
                        selectedSizeIndex === index
                          ? "border-[var(--purpleDark)]"
                          : "border-transparent"
                      }`}
                      key={index}
                    >
                      <div
                        className={`${
                          sz.stock < 1 &&
                          "text-[var(--light)] line-through decoration-2 decoration-[var(--light)]"
                        } h-7 w-7 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase flex justify-center items-center font-bold`}
                      >
                        {sz.size}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          {/* size box ends */}

          {/* price and rating container begins */}
          <div className="grid grid-cols-[2.5fr_4fr] items-center">
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
              <div className="absolute flex justify-center items-center w-fit top-1/2 -translate-y-1/2 left-1">
                <BsCurrencyRupee className="text-md" />
                <span className="text-md font-bold">
                  {variant.images[selectedColorIndex].price}
                </span>
              </div>
              {/* price ends */}
            </div>
            {/* svg and price container emd */}

            {/* rating begins */}
            <div className="flex justify-end items-center gap-1 pr-2">
              <FaStar className="text-xl text-[var(--purpleDark)]" />
              <span className="text-xl text-[var(--purpleDark)] font-bold">
                {variant.product.ratings}
              </span>
            </div>
            {/* rating ends */}
          </div>
          {/* price and rating container ends */}

          {totalStock > 0 ? (
            <p className="text-green-600 font-bold">In Stock</p>
          ) : (
            <p className="text-red-600 font-bold">Out of Stock</p>
          )}

          {/*increase/decrease quanity begins */}
          {totalStock > 0 && (
            <div className="grid grid-cols-2 items-center justify-items-center">
              <h3 className="justify-self-start text-xl">Quantity</h3>

              <div className="grid grid-cols-3 items-center justify-items-center w-full">
                <FaPlusSquare
                  className="text-2xl active:text-[var(--purpleDark)] transition-colors"
                  onClick={increaseQuantity}
                />
                <span className="text-xl font-bold">{quantity}</span>
                <FaMinusSquare
                  className="text-2xl active:text-[var(--purpleDark)] transition-colors"
                  onClick={decreaseQuantity}
                />
              </div>
            </div>
          )}
          {/*increase/decrease quanity begins */}

          {/* shipping Address begins */}
          {isLoggedIn && <ShippingAddressSelector />}
          {/* shipping Address ends */}

          {currentStock > 0 && (
            <div className="grid grid-cols-2 items-center justify-items-center gap-5 mt-4">
              <span onClick={handleAddToCart} className="w-full">
                <OutlineButton name={"Add To Cart"} />
              </span>
              <Checkout details={{id:variant._id,productData:{...(variant.needSize?{quantity,sizeIndex: selectedSizeIndex,colorIndex: selectedColorIndex}:{quantity, colorIndex: selectedColorIndex})}}} />
            </div>
          )}

          {/* description begins */}
          <h2 className="text-center border-t-1 border-black mt-5 pt-1 text-2xl font-bold">
            Description
          </h2>
          <p className="text-md text-pretty text-center border-b-1 border-black mb-5 pb-5">
            {variant.product.description}
          </p>
          {/* description ends */}

          {/* Rating and reviews begins */}

          <h2 className="text-2xl text-center">Ratings & Reviews</h2>
          {isLoggedIn &&
            user?.orderedProducts.includes(variant.product._id) &&
            !isReviewed && <ReviewModal id={variant.product._id} />}

          {/* overvall rating begins */}
          <div className="grid grid-rows-3 items-center justify-items-center mt-4 gap-0">
            <h3 className="text-xl text-[var(--light)] font-bold">
              {ratingLabels[variant.product.ratings]}
            </h3>
            <Box sx={{ "& > legend": { mt: 2 } }}>
              <Rating
                name="simple-controlled"
                value={variant.product.ratings}
                readOnly
                size="large"
                sx={{
                  color: "var(--purpleDark)", // or any CSS color
                }}
              />
            </Box>
            <p className="text-md text-[var(--light)] -mt-4">
              {totalRatings} {totalRatings > 1 ? "ratings" : "rating"} and{" "}
              {reviewsCount} {reviewsCount > 1 ? "reviews" : "review"}
            </p>
          </div>
          {/* overvall rating ends */}

          {/* rating progressbar begins */}
          <div className="grid grid-rows-5 items-center justify-items-center">
            {[5, 4, 3, 2, 1].map((value, index) => {
              const maxCount = Math.max(...Object.values(allRatings)) || 1; // avoid divide by 0
              const percent = (allRatings[value] / maxCount) * 100;
              return (
                <div
                  className="grid grid-cols-[1fr_4fr_1fr] items-center gap-3 w-full"
                  key={index}
                >
                  <span className="flex justify-center items-center gap-1">
                    <span className="text-[var(--purpleDark)] text-lg">
                      {value}
                    </span>
                    <FaStar className="text-[var(--purpleDark)] text-lg" />
                  </span>
                  <BorderLinearProgress variant="determinate" value={percent} />
                  <h4 className="text-lg justify-self-end text-[var(--light)]">
                    {abbreviateNumber(allRatings[value])}
                  </h4>
                </div>
              );
            })}
          </div>
          {/* rating progressbar ends */}

          {/* reviews begins */}
          <div className="flex flex-col justify-center items-center gap-4 mt-5">
            {reviews?.length > 0 ? (
              reviews.map((review) => {
                return (
                  <div key={review._id} className="w-full">
                    <ReviewCard review={review} id={variant.product._id} />
                  </div>
                );
              })
            ) : (
              <h2 className="text-xl my-5 font-bold text-[var(--light)]">
                No reviews yet
              </h2>
            )}
          </div>
          {/* reviews ends */}

          {/* Rating and reviews ends */}
        </article>
      ) : (
        <article className="w-full min-h-full border border-[var(--black)] bg-[var(--white)] p-2 flex flex-col gap-2 mt-5">
          <picture className="w-full h-55 block">
            <Skeleton height={"100%"} />
          </picture>

          {/* product name begins */}
          <p className="line-clamp-3 text-xl">
            <Skeleton />
          </p>
          {/* product name ends */}

          {/* price and rating container begins */}
          <div className="grid grid-cols-[2.5fr_4fr] items-center">
            <Skeleton height={40} />

            <div className="flex justify-end items-center gap-1 pr-2">
              <Skeleton width={70} height={30} />
            </div>
          </div>
          {/* price and rating container ends */}

          <p>
            {" "}
            <Skeleton style={{ lineHeight: "initial" }} width={"40%"} />
          </p>

          {/*increase/decrease quanity begins */}
          <div className="grid grid-cols-2 items-center justify-items-center">
            <h3 className="justify-self-start text-xl">
              <Skeleton height={35} width={150} />
            </h3>

            <Skeleton height={30} width={150} />
          </div>
          {/*increase/decrease quanity begins */}

          <div className="mt-2">
            <Skeleton height={30} width={150} />
            <Skeleton height={30} width={"100%"} />
          </div>

          <div className="grid grid-cols-2 items-center justify-items-center gap-5 mt-4">
            <Skeleton height={40} width={150} />
            <Skeleton height={40} width={150} />
          </div>

          {/* description begins */}
          <h2 className="text-center border-t-1 border-black mt-5 pt-1 text-2xl font-bold">
            <Skeleton height={30} width={200} />
          </h2>
          <p className="text-md text-pretty text-center border-b-1 border-black mb-5 pb-5">
            <Skeleton count={8} />
          </p>
          {/* description ends */}

          {/* Rating and reviews begins */}

          <h2 className="text-2xl text-center">
            {" "}
            <Skeleton height={30} width={200} />
          </h2>
          <Skeleton height={40} width={"100%"} />

          {/* overvall rating begins */}
          <div className="grid grid-rows-3 items-center justify-items-center mt-4 gap-0">
            <h3 className="text-xl text-[var(--light)] font-bold">
              {" "}
              <Skeleton height={25} width={100} />
            </h3>
            <Skeleton height={20} width={155} />
            <p className="text-md text-[var(--light)] -mt-2">
              <Skeleton width={150} />
            </p>
          </div>
          {/* overvall rating ends */}

          {/* rating progressbar begins */}
          <div className="grid grid-rows-5 items-center justify-items-center">
            {[5, 4, 3, 2, 1].map((value, index) => {
              return (
                <div
                  className="grid grid-cols-[1fr_4fr_1fr] items-center gap-3 w-full"
                  key={index}
                >
                  <span className="flex justify-center items-center gap-2">
                    <span className="text-[var(--purpleDark)] text-lg">
                      <Skeleton width={16} height={16} />
                    </span>
                    <Skeleton width={16} height={16} />
                  </span>
                  <Skeleton width={"100%"} height={10} />
                  <h4 className="text-lg justify-self-end text-[var(--light)]">
                    <Skeleton width={80} height={20} />
                  </h4>
                </div>
              );
            })}
          </div>
          {/* rating progressbar ends */}

          {/* Rating and reviews ends */}
        </article>
      )}
    </div>
  );
};
