import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const focusElement = (key, ref) => {
  if (key.includes("_icon")) {
    document.getElementById(key).focus();
  } else {
    ref.focus();
  }
};

const slideToErrorField = (ref, key, swipers) => {
  let slideElement = undefined;

  if (!Object.keys(ref).includes("select")) {
    slideElement = ref.closest(".swiper-slide");
  } else {
    slideElement = document
      .getElementById(key)
      .parentElement.closest(".swiper-slide");
  }

  if (!slideElement) {
    focusElement(key,ref)
    return;
  }

  const slides = Array.from(slideElement.parentNode.children);
  const slideIndex = Number(slideElement.dataset.swiperSlideIndex) || 0

  const mainSwiper = swipers.main.current;

  if (slideElement.classList.contains("parentSlide")) {
    if (slides.length > 1 && mainSwiper.realIndex !== slideIndex) {
      mainSwiper.slideToLoop(slideIndex, 500);
      mainSwiper.once("slideChangeTransitionEnd", () => {
        focusElement(key, ref);
      });
    } else {
      focusElement(key, ref);
    }
  } else {
    const parentSlideElement = slideElement.closest(".parentSlide");

    if (!parentSlideElement) return;

    const parentSlideIndex = Number(parentSlideElement.dataset.swiperSlideIndex) || 0

    const childSwiper = swipers.childs.current[parentSlideIndex];

    const runChildSlide = () => {
      if (slides.length > 1 && childSwiper.realIndex !== slideIndex) {
        childSwiper.slideToLoop(slideIndex, 500);
        childSwiper.once("slideChangeTransitionEnd", () => {
          ref.focus();
        });
      } else {
        ref.focus();
      }
    };

    // If parent is already on the right slide
    if (mainSwiper.realIndex === parentSlideIndex) {
      runChildSlide();
    } else {
      mainSwiper.slideToLoop(parentSlideIndex, 500);
      mainSwiper.once("slideChangeTransitionEnd", runChildSlide);
    }
  }
};

// Recursively search for the first message/type in a nested object
function findFirstError(obj, parentKey = "") {
  if (!obj) return null;

  if (typeof obj === "object") {
    // Direct message/type on this object
    if ("message" in obj || "type" in obj) {
      return {
        key: parentKey,
        message: obj.message ?? null,
        type: obj.type ?? null,
        ref: obj.ref ?? null,
      };
    }

    // Search in nested values (arrays/objects)
    for (const [k, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${k}` : k; // build path
      const found = findFirstError(value, newKey);
      if (found) return found;
    }
  }

  return null;
}

const showError = (errors, lastErrorKeyRef, toast, swipers) => {
  if (!errors || Object.keys(errors).length === 0) return;

  const firstKey = Object.keys(errors)[0];
  const found = findFirstError(errors[firstKey], firstKey);

  if (found) {
    const { message: msg, type, key, ref } = found;

    if (swipers) {
      slideToErrorField(ref, key, swipers);
    }

    if (
      lastErrorKeyRef.current?.key !== key ||
      lastErrorKeyRef.current?.type !== type
    ) {
      toast.error(msg);
      lastErrorKeyRef.current = { key, type }; // ✅ remember last shown error key
    }
  }
};

export const useValidationErrorToast = (errors, swipers = undefined) => {
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast, swipers);
  }, [errors]);
};
