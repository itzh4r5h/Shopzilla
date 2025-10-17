import { NavLink, useParams } from "react-router";
import { BsCurrencyRupee } from "react-icons/bs";
import { OutlineButton } from "../../components/buttons/OutlineButton";
import { useDispatch, useSelector } from "react-redux";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { useEffect } from "react";
import {
  getOrdersByStatus,
  updateOrderStatus,
} from "../../store/thunks/adminThunks";
import { formatMongodbDate } from "../../utils/helpers";
import { ImageCard } from "../../components/cards/ImageCard";
import { clearAdminError,clearAdminMessage} from "../../store/slices/adminSlice";
import { useToastNotify } from "../../hooks/useToastNotify";

export const UserOrders = () => {
  const orderStatus = [
    "confirmed",
    "processing",
    "shipped",
    "dispatched",
    "out for delivery",
    "delivered",
  ];

  const { status } = useParams();
  const dispatch = useDispatch();
  const { loading, orders, error, success, message, updated } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getOrdersByStatus(status));
  }, [status]);

  useEffect(() => {
    if (updated) {
      dispatch(getOrdersByStatus(status));
    }
  }, [updated]);

 useToastNotify(error,success,message,clearAdminError,clearAdminMessage,dispatch)

  return (
    <div className="h-full relative">
      <h1 className="text-2xl text-center font-semibold">Orders</h1>

      {/* orders status begins */}
      <div className="overflow-x-auto w-full my-5">
        <div className="flex items-center gap-3">
          {orderStatus.map((status, index) => {
            return (
              <NavLink
                to={`/admin/dashboard/orders/${status}`}
                key={index + status}
              >
                {({ isActive }) => {
                  return (
                    <li
                      className={`${
                        isActive
                          ? "bg-[var(--purpleDark)] text-white"
                          : "bg-white border-2"
                      } border-2 border-black list-none rounded-md p-1 capitalize w-35 shrink-0 whitespace-nowrap text-center`}
                    >
                      {status}
                    </li>
                  );
                }}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* order status ends */}

      {/* order begins */}
      <div className="flex flex-col justify-center gap-5">
        {loading &&
          [1, 2].map((_, index) => {
            return (
              <article
                className="bg-white border border-black rounded-md p-2"
                key={index}
              >
                <h3 className="text-center text-md text-[var(--light)]">
                  <Skeleton width={"65%"} />
                </h3>

                {/* order amount begins */}
                <h2 className="grid grid-cols-2 text-xl">
                  <span>
                    <Skeleton />
                  </span>
                  <span className="text-right">
                    <Skeleton width={"80%"} />
                  </span>
                </h2>
                {/* order amount ends */}

                <h2 className="grid grid-cols-2 text-xl">
                  <span>
                    <Skeleton />
                  </span>
                  <span className="text-right">
                    <Skeleton width={"80%"} />
                  </span>
                </h2>

                <div className="grid grid-rows-2 items-center mt-2 mb-4">
                  <h2 className="text-xl text-center">
                    <Skeleton width={"70%"} />
                  </h2>
                  <Skeleton height={35} />
                </div>

                <picture className="w-full block h-35 overflow-hidden">
                  <Skeleton height={"100%"} />
                </picture>
              </article>
            );
          })}

        {!loading &&
          orders?.length > 0 &&
          orders?.map((order) => {
            let productsOrdered = 0;
            order.orderItems.forEach(
              (product) => (productsOrdered += product.quantity)
            );
            // find index of orderStatus like confirmed if status index is less than orderStatus array length than add 1 into it otherwise don't add
            let orderStatusIndex = orderStatus.indexOf(order.orderStatus);
            orderStatusIndex =
              orderStatusIndex < orderStatus.length
                ? orderStatusIndex + 1
                : orderStatusIndex;
            return (
              <article
                className="bg-white border border-black rounded-md p-2"
                key={order._id}
              >
                <h3 className="text-center text-md text-[var(--light)]">
                  Ordered on {formatMongodbDate(order.confirmed)}
                </h3>

                {/* order amount begins */}
                <h2 className="grid grid-cols-2 text-xl">
                  <span>Order Amount</span>
                  <span className="flex justify-center items-center justify-self-end">
                    <BsCurrencyRupee />
                    <span>{order.totalPrice}</span>
                  </span>
                </h2>
                {/* order amount ends */}

                <h2 className="grid grid-cols-2 text-xl">
                  <span>Products Ordered</span>
                  <span className="flex justify-center items-center justify-self-end">
                    {productsOrdered}
                  </span>
                </h2>


                {
                  order.orderStatus === 'delivered' && <h2 className="grid grid-cols-2 text-xl mb-5">
                  <span>Order Status</span>
                  <span className="flex justify-center items-center justify-self-end text-green-500">
                    Delivered
                  </span>
                </h2>
                }

                {order.orderStatus !== 'delivered' && <div className="grid grid-rows-2 items-center mt-2 mb-4">
                  <h2 className="text-xl text-center">Update Status To</h2>
                  <span
                    onClick={() =>
                      dispatch(
                        updateOrderStatus({
                          id: order._id,
                          status: orderStatus[orderStatusIndex],
                        })
                      )
                    }
                  >
                    <OutlineButton name={orderStatus[orderStatusIndex]} />
                  </span>
                </div>}

                {/*ordered products container begins */}
                <Swiper
                  loop={order.orderItems.length > 1 ? true : false}
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
                  {order.orderItems.map((product) => {
                    return (
                      <SwiperSlide key={product._id}>
                        <div className="grid grid-cols-[2.5fr_4fr] gap-2 bg-white w-full border border-[var(--light)] p-1 rounded-md">
                          <picture className="w-full block h-35">
                            <ImageCard
                              src={{
                                url: product.image,
                                name: product.name,
                              }}
                            />
                          </picture>

                          <div>
                            <p className="line-clamp-3 text-lg my-2">
                              {product.name}
                            </p>

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
                                <div className="absolute flex justify-center items-center w-fit top-1/2 -translate-y-1/2 left-1">
                                  <BsCurrencyRupee className="text-sm" />
                                  <span className="text-sm">
                                    {product.price}
                                  </span>
                                </div>
                                {/* price ends */}
                              </div>
                              {/* svg and price container emd */}

                              {/* quantity begins */}
                              <div className="flex justify-center items-center gap-1">
                                <span className="text-md font-bold">Qt.</span>
                                <span className="text-md font-bold">
                                  {product.quantity}
                                </span>
                              </div>
                              {/* quantity ends */}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {/*ordered products container ends */}
              </article>
            );
          })}
      </div>
      {!loading && orders?.length < 1 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Orders Yet
        </p>
      )}
      {/* order ends */}
    </div>
  );
};
