import { BsCurrencyRupee } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FillButton } from "../components/buttons/FillButton";
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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../store/thunks/productThunks";
import { useParams } from "react-router";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ImageCard } from "../components/cards/ImageCard";
import { toast } from "react-toastify";
import { clearErrors } from "../store/slices/productSlice";

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

export const ProductDetails = ({ path, mainRef }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { error, product } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetails(id));

    mainRef.current.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    // this shows the error if error exists
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  const reviews = 2;
  return (
    <div>
      <Heading name={"Product Details"} path={path} />
      {product ? (
        <article className="w-full min-h-full border border-[var(--black)] bg-[var(--white)] p-2 flex flex-col gap-2 mt-5">
          <Swiper
            loop={product?.images?.length > 1 ? true : false}
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
            {product.images.map((img) => {
              return (
                <SwiperSlide key={img._id}>
                  <picture className="w-full h-55 block relative overflow-hidden bg-white">
                    <ImageCard src={img} product={true} />
                  </picture>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* product name begins */}
          <p className="line-clamp-3 text-xl">{product.name}</p>
          {/* product name ends */}

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
                <span className="text-md font-bold">{product.price}</span>
              </div>
              {/* price ends */}
            </div>
            {/* svg and price container emd */}

            {/* rating begins */}
            <div className="flex justify-end items-center gap-1 pr-2">
              <FaStar className="text-xl text-[var(--purpleDark)]" />
              <span className="text-xl text-[var(--purpleDark)] font-bold">
                {product.ratings}
              </span>
            </div>
            {/* rating ends */}
          </div>
          {/* price and rating container ends */}

          {/*increase/decrease quanity begins */}
          <div className="grid grid-cols-2 items-center justify-items-center">
            <h3 className="justify-self-start text-xl">Quantity</h3>

            <div className="grid grid-cols-3 items-center justify-items-center w-full">
              <FaPlusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
              <span className="text-xl font-bold">1</span>
              <FaMinusSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
            </div>
          </div>
          {/*increase/decrease quanity begins */}

          <div className="grid grid-cols-2 items-center justify-items-center gap-5 mt-4">
            <OutlineButton name={"Add To Cart"} />
            <FillButton name={"Buy Now"} />
          </div>

          {/* description begins */}
          <h2 className="text-center border-t-1 border-black mt-5 pt-1 text-2xl font-bold">
            Description
          </h2>
          <p className="text-md text-pretty text-center border-b-1 border-black mb-5 pb-5">
            {product.description}
          </p>
          {/* description ends */}

          {/* Rating and reviews begins */}

          <h2 className="text-2xl text-center">Ratings & Reviews</h2>
          <FillButton name={"Rate Product"} />

          {/* overvall rating begins */}
          <div className="grid grid-rows-3 items-center justify-items-center mt-4 gap-0">
            <h3 className="text-xl text-[var(--light)] font-bold">Good</h3>
            <Box sx={{ "& > legend": { mt: 2 } }}>
              <Rating
                name="simple-controlled"
                value={4}
                readOnly
                size="large"
                sx={{
                  color: "var(--purpleDark)", // or any CSS color
                }}
              />
            </Box>
            <p className="text-md text-[var(--light)] -mt-4">
              1 rating and 0 reviews
            </p>
          </div>
          {/* overvall rating ends */}

          {/* rating progressbar begins */}
          <div className="grid grid-rows-5 items-center justify-items-center">
            {[5, 4, 3, 2, 1].map((value, index) => {
              return (
                <div
                  className="grid grid-cols-[1fr_4fr_1.5fr] items-center gap-3 w-full"
                  key={index}
                >
                  <span className="flex justify-center items-center gap-1">
                    <span className="text-[var(--purpleDark)] text-lg">
                      {value}
                    </span>
                    <FaStar className="text-[var(--purpleDark)] text-lg" />
                  </span>
                  <BorderLinearProgress variant="determinate" value={1.5} />
                  <h4 className="text-lg justify-self-end text-[var(--light)]">
                    1240
                  </h4>
                </div>
              );
            })}
          </div>
          {/* rating progressbar ends */}

          {/* reviews begins */}
          <div className="flex flex-col justify-center items-center gap-4 mt-5">
            {!reviews ? (
              <h2 className="text-xl my-5 font-bold text-[var(--light)]">
                No reviews yet
              </h2>
            ) : (
              <div className="flex flex-col gap-0 justify-center">
                <div className="grid grid-cols-2 items-center pr-2">
                  <h3 className="text-lg font-medium">Abhishek singh</h3>
                  <FaEdit className="text-xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
                </div>
                <Box sx={{ "& > legend": { mt: 2 } }}>
                  <Rating
                    name="simple-controlled"
                    value={4}
                    readOnly
                    size="medium"
                    sx={{
                      color: "var(--purpleDark)", // or any CSS color
                    }}
                  />
                </Box>
                <p className="text-md">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem, praesentium!
                </p>
              </div>
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

          {/*increase/decrease quanity begins */}
          <div className="grid grid-cols-2 items-center justify-items-center">
            <h3 className="justify-self-start text-xl">
              <Skeleton height={35} width={150} />
            </h3>

            <Skeleton height={30} width={150} />
          </div>
          {/*increase/decrease quanity begins */}

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
                  className="grid grid-cols-[1fr_4fr_1.5fr] items-center gap-3 w-full"
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
