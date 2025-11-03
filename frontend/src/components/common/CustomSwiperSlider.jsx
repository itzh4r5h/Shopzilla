import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { cloneElement, useEffect } from "react";

export const CustomSwiperSlider = ({
  children,
  swiperRef,
  slideData,
  nested = false,
  space = 10,
  keyIsId = true,
  isParentSlide = true,
  pb = "pb-8",
  className,
  isChildRef = false,
  i = 0,
}) => {
  useEffect(() => {
    if (isChildRef) {
      if (swiperRef.current[i]) {
        swiperRef.current[i].update();
        swiperRef.current[i].slideTo(slideData.length - 1);
      }
    } else {
      if (swiperRef.current) {
        swiperRef.current.update();
        swiperRef.current.slideTo(slideData.length - 1); // go to last added
      }
    }
  }, [slideData, isChildRef, i]);
  return (
    <div className="grid">
      <Swiper
        onSwiper={(swiper) =>
          isChildRef
            ? (swiperRef.current[i] = swiper)
            : (swiperRef.current = swiper)
        }
        loop={slideData.length > 1 ? true : false}
        pagination={{ type: "fraction" }}
        grabCursor={true}
        modules={[Pagination]}
        className={className}
        spaceBetween={space}
        nested={nested}
      >
        {slideData.map((data, index) => {
          return (
            <SwiperSlide
              key={keyIsId ? data.id : index}
              className={`${pb} ${isParentSlide && "parentSlide"}`}
            >
              {cloneElement(children, { data,index })}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
