import { FillButton } from "../../components/buttons/FillButton";
import { Heading } from "../../components/Headers/Heading";
import { useForm } from "react-hook-form";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaTimesCircle } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { showError } from "../../utils/showError";
import { useDispatch, useSelector } from "react-redux";
import { NormalSelect } from "../../components/selectors/NormalSelect";
import { toast } from "react-toastify";
import { clearErrors, clearMessage } from "../../store/slices/adminSlice";
import { addProduct } from "../../store/thunks/adminThunks";

export const AddOrEditProduct = ({ edit = false, name }) => {
  const maxImages = Number(import.meta.env.VITE_PRODUCT_MAX_IMAGES);
  const MAX_SIZE_MB = Number(import.meta.env.VITE_IMAGE_MAX_SIZE_IN_MB);
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const schema = useMemo(() => {
    return Joi.object({
      name: Joi.string().min(2).max(30).trim().required().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least {#limit} characters long",
        "string.max": "Product name cannot be more than {#limit} characters",
        "any.required": "Product name is required",
      }),

      description: Joi.string().min(10).max(10000).trim().required().messages({
        "string.base": "Description must be a string",
        "string.empty": "Description is required",
        "string.min": "Description must be at least {#limit} characters long",
        "string.max": "Description cannot be more than {#limit} characters",
        "any.required": "Description is required",
      }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
      }),

      category: Joi.string().trim().required().messages({
        "string.base": "Category must be a string",
        "string.empty": "Category is required",
        "any.required": "Category is required",
      }),

      stock: Joi.number().min(0).messages({
        "number.base": "Stock must be a number",
        "number.min": "Stock cannot be negative",
      }),

      images: Joi.array()
        .items(
          Joi.custom((file, helpers) => {
            const allowedTypes = ["image/png", "image/jpeg"];

            if (!allowedTypes.includes(file.type)) {
              return helpers.error("file.type");
            }

            if (file.size > MAX_SIZE_BYTES) {
              return helpers.error("file.size");
            }

            return file; // valid
          })
        )
        .min(1)
        .max(maxImages)
        .required()
        .messages({
          "array.base": "Images must be in an array format",
          "array.min": "Please upload at least one image",
          "array.max": `You can upload a maximum of ${maxImages} images`,
          "file.type": "Only PNG or JPEG files are allowed",
          "file.size": `File size must not exceed ${MAX_SIZE_MB}MB`,
        }),
    });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { images: [] }, resolver: joiResolver(schema) });

  const images = watch("images");

  const chooseImages = (e) => {
    const selectedImages = Array.from(e.target.files);

    // Optional: filter only jpg/png files
    const validImages = selectedImages.filter(
      (file) => file.type === "image/png" || file.type === "image/jpeg"
    );

    setValue("images", [...(images || []), ...validImages], {
      shouldValidate: true,
    });
  };

  const removeImage = (index) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const dispatch = useDispatch();
  const { error, success, message, loading } = useSelector(
    (state) => state.admin
  );
  const { user } = useSelector((state) => state.user);

  const submitForm = (data) => {
    dispatch(addProduct(data));
    reset()
  };

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);
  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  useEffect(() => {
    // this shows the error if error exists
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  // show the success message when both success and message are defined
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);


  const categories = [
    "mobile",
    "laptop",
    "shirt",
    "jeans",
    "earphone",
    "headphone",
    "earbuds",
  ];

  return (
    <div>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(submitForm)}
        className="bg-white border border-black w-full p-3 flex flex-col justify-center gap-5"
      >
        {edit ? (
          <Heading
            name={name + " Product"}
            path={"/admin/dashboard/products"}
          />
        ) : (
          <h1 className="text-center text-2xl">{name} Product</h1>
        )}

        {/* name begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="name" className="text-xl w-fit">
            Name
          </label>
          <input
            {...register("name", { required: true })}
            id="name"
            className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
            autoComplete="off"
          />
        </div>
        {/* name ends */}

        {/* description begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="description" className="text-xl w-fit">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            id="description"
            className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)] h-50"
            autoComplete="off"
          />
        </div>
        {/* description ends */}

        {/* price begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="price" className="text-xl w-fit">
            Price
          </label>
          <input
            type="number"
            {...register("price", { required: true })}
            id="price"
            className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
            autoComplete="off"
          />
        </div>
        {/* price ends */}

        {/* stock begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="stock" className="text-xl w-fit">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", { required: true })}
            id="stock"
            className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
            autoComplete="off"
          />
        </div>
        {/* stock ends */}

        {/* category begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="category" className="text-xl w-fit">
            Category
          </label>
          <NormalSelect
            name="category"
            defaultValue={"Select Category"}
            register={register}
            setValue={setValue}
            optionsData={categories}
          />
        </div>
        {/* category ends */}

        {/* images begins */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="grid grid-cols-2 items-center w-full">
            <h1 className="text-xl">Images</h1>
            <label
              htmlFor="images"
              className="justify-self-end flex justify-center items-center bg-[var(--purpleDark)] text-white py-1 px-2 gap-1 rounded-md"
            >
              <MdOutlineFileUpload className="text-lg" />
              <span className="text-md">Choose</span>
            </label>
            <input
              type="file"
              {...register("images", { required: true })}
              name="images"
              id="images"
              accept="image/png, image/jpeg"
              multiple
              className="hidden"
              onChange={chooseImages}
            />
          </div>
          {images.length !== 0 ? (
            <Swiper
              loop={images.length > 1 ? true : false}
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
              {images.map((img, index) => {
                return (
                  <SwiperSlide key={index}>
                    <picture className="w-full h-55 block relative border">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name.split(".")[0]}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <FaTimesCircle
                        className="self-end text-2xl absolute top-2 right-2 z-100 text-[var(--purpleDark)]"
                        onClick={() => {
                          removeImage(index);
                        }}
                      />
                    </picture>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="w-full h-55 flex justify-center items-center text-xl border border-black">
              Images Preview
            </div>
          )}
        </div>
        {/* images ends */}

        <span>
          {loading?<FillButton type="button" name={'Creating...'}/>:<FillButton
            type="submit"
            name={`${name.split(" ")[0]} Product`}
          />}
        </span>
      </form>
    </div>
  );
};
