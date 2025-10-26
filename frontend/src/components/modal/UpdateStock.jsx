import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { stockJoiSchema } from "../../validators/productValidators";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { updateStock } from "../../store/thunks/admin/variantThunk";

export const UpdateStock = ({ variant }) => {
  const schema = useMemo(() => {
    return stockJoiSchema(variant.needSize);
  }, [variant.needSize]);

  const getDefaultValues = (variant) => {
    if (variant.needSize) {
      return {
        sizes: variant.images[variant.selectedProduct].sizes
          .filter(({ _id, ...sz }) => sz.stock === 0)
          .map(({ size, stock }) => ({ size, stock })),
      };
    } else {
      return {
        stock: variant.images[variant.selectedProduct].stock,
      };
    }
  };

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(variant),
    resolver: joiResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    const stockData = {
      needSize: variant.needSize,
      originalIndex: variant.originalIndex,
    };
    if (variant.needSize) {
      stockData.sizes = data.sizes;
    } else {
      stockData.stock = data.stock;
    }

    dispatch(updateStock({ id: variant._id, stockData }));
    handleClose();
  };

  useValidationErrorToast(errors);

  const sizes = variant.needSize ? watch("sizes") || [] : [];

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton
          size="text-md"
          padding="px-1 py-0.5 mb-0.5"
          name={"update"}
        />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-999 bg-[#00000089] p-2 py-4 overflow-y-auto grid place-items-center">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="bg-white w-full border border-black p-3 flex flex-col justify-center gap-5"
            >
              <FaTimesCircle
                className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
                onClick={handleClose}
              />

              <h1 className="text-center text-3xl -mt-5">Update Stock</h1>

              <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-2">
                  <h3 className="text-2xl capitalize">Name</h3>
                  <h3 className="text-xl line-clamp-2 capitalize text-[var(--light)]">
                    {variant.product.name}
                  </h3>
                </div>
                <div className="grid grid-cols-2">
                  <h3 className="text-2xl capitalize">Color</h3>
                  <div
                    className="h-10 w-15 rounded-3xl border-2"
                    style={{
                      backgroundColor:
                        variant.images[variant.selectedProduct].color,
                    }}
                  ></div>
                </div>
                {!variant.needSize && (
                  <div className="grid grid-cols-2 justify-center gap-2">
                    <label htmlFor="stock" className="text-2xl w-fit">
                      Stock
                    </label>
                    <input
                      autoComplete="off"
                      {...register("stock", {
                        required: true,
                      })}
                      id="stock"
                      className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                    />
                  </div>
                )}

                <div className="grid">
                  {variant.needSize && sizes.length > 0 && (
                    <Swiper
                      loop={sizes?.length > 1 ? true : false}
                      pagination={{ clickable: true, type: "fraction" }}
                      grabCursor={true}
                      modules={[Pagination]}
                      className="mySwiper"
                      spaceBetween={10}
                    >
                      {sizes.map((data, index) => {
                        return (
                          <SwiperSlide key={index} className="pb-10 px-2">
                            <div className="grid grid-cols-2 gap-x-2 relative">
                              {/* size begins */}
                              <div className="flex flex-col justify-center gap-2">
                                <label
                                  htmlFor={`sizes.${index}.size`}
                                  className="text-xl w-fit"
                                >
                                  Size
                                </label>
                                <input
                                  readOnly
                                  disabled
                                  autoComplete="off"
                                  {...register(`sizes.${index}.size`, {
                                    required: true,
                                  })}
                                  id={`sizes.${index}.size`}
                                  className="uppercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                                />
                              </div>
                              {/* size ends */}
                              {/* stock begins */}
                              <div className="flex flex-col justify-center gap-2">
                                <label
                                  htmlFor={`sizes.${index}.stock`}
                                  className="text-xl w-fit"
                                >
                                  Stock
                                </label>
                                <input
                                  autoComplete="off"
                                  {...register(`sizes.${index}.stock`, {
                                    required: true,
                                  })}
                                  id={`sizes.${index}.stock`}
                                  className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                                />
                              </div>
                              {/* stock ends */}
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </div>
              </div>

              <FillButton type="submit" name="Update" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
