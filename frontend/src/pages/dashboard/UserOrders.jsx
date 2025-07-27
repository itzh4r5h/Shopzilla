import { NavLink, useLocation, useParams } from "react-router";
import { BsCurrencyRupee } from "react-icons/bs";
import { OutlineButton } from "../../components/buttons/OutlineButton";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

export const UserOrders = () => {
  const orderStatus = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "dispatched",
    "out for delivery",
    "delivered",
  ];

  return (
    <div>
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
        {[1, 2, 4].map((item, index) => {
          return (
            <article
              className="bg-white border border-black rounded-md p-2"
              key={index}
            >
              <h3 className="text-center text-md text-[var(--light)]">
                Ordered on 10 May, 2025
              </h3>

              {/* order amount begins */}
              <h2 className="grid grid-cols-2 text-xl">
                <span>Order Amount</span>
                <span className="flex justify-center items-center justify-self-end">
                  <BsCurrencyRupee />
                  <span>15000</span>
                </span>
              </h2>
              {/* order amount ends */}

              <h2 className="grid grid-cols-2 text-xl">
                <span>Products Ordered</span>
                <span className="flex justify-center items-center justify-self-end">
                  6
                </span>
              </h2>

              <div className="grid grid-rows-2 items-center mt-2 mb-4">
                <h2 className="text-xl text-center">Update Status To</h2>
                <OutlineButton name={"Shipped"} />
              </div>

              {/*ordered products container begins */}
              <Swiper
                loop={item>1?true:false}
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
                {[...Array(item)].map((v, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="grid grid-cols-[2.5fr_4fr] gap-2 bg-white w-full border p-1 rounded-md h-35">
                        <picture className="w-full h-full block">
                          <img
                            src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="woman purse"
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </picture>

                        <div>
                          <p className="line-clamp-2 text-md my-2">
                            Brown purse, premium version asdf asdfsdf asdfasdf
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
                                <span className="text-sm">14999</span>
                              </div>
                              {/* price ends */}
                            </div>
                            {/* svg and price container emd */}

                            {/* quantity begins */}
                            <div className="flex justify-center items-center gap-1">
                              <span className="text-md font-bold">Qt.</span>
                              <span className="text-md font-bold">4</span>
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
      {/* order ends */}
    </div>
  );
};
