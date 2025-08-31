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
import { useDispatch, useSelector } from "react-redux";
import { NormalSelect } from "../../components/selectors/NormalSelect";
import {
  clearAdminError,
  clearAdminMessage,
} from "../../store/slices/adminSlice";
import { addProduct, updateProduct } from "../../store/thunks/adminThunks";
import { getProductDetails } from "../../store/thunks/productThunks";
import { useLocation, useNavigate, useParams } from "react-router";
import { clearProductDetails } from "../../store/slices/productSlice";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { useToastNotify } from "../../hooks/useToastNotify";

export const AddOrEditProduct = ({ edit = false, name }) => {
  const maxImages = Number(import.meta.env.VITE_PRODUCT_MAX_IMAGES);
  const MAX_SIZE_MB = Number(import.meta.env.VITE_IMAGE_MAX_SIZE_IN_MB);
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const schema = useMemo(() => {
    return 
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { images: [] }, resolver: joiResolver(schema) });

  const images = watch("images");
  const { id } = useParams();
  const path = useLocation();
  const navigate = useNavigate();
  const [removedImagesFileIds, setRemovedImagesFileIds] = useState([]);

  const dispatch = useDispatch();
  const { error, success, message, loading } = useSelector(
    (state) => state.admin
  );
  const { product, categories } = useSelector((state) => state.products);

  const chooseImages = (e) => {
    const selectedImages = Array.from(e.target.files);
    // Optional: filter only jpg/png files
    const validImages = selectedImages.filter(
      (file) =>
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/webp"
    );

    setValue("images", [...(images || []), ...validImages], {
      shouldValidate: true,
    });
  };

  const removeImage = (index) => {
    setValue(
      "images",
      images.filter((img, i) => {
        if (i === index) {
          // This is the one we're removing
          if (img.url) {
            setRemovedImagesFileIds((prev) => [...prev, img.fileId]);
          }
          return false; // exclude from array
        }
        return true; // keep others
      }),
      { shouldValidate: true }
    );
  };

  // this submits the form
  const submitForm = (data) => {
    if (edit) {
      // as in db we have images array like this
      // [{url:'image_url',fileId:'file_id',name:'image_name'}]
      // before submitting data to sever we will remove these from images array as these are already uploaded
      data.images = data.images.filter((img) => !img.url);

      // store the deleted images fileIds in removedImagesFileIds
      data.removedImagesFileIds = [...removedImagesFileIds];
      data.id = product?._id;
      dispatch(updateProduct(data));
      reset();
      navigate("/admin/dashboard/products");
    } else {
      dispatch(addProduct(data));
      reset();
    }
  };

  // this shows the form validtion related errors
  useValidationErrorToast(errors);

  // this shows the error and success message received from server
  useToastNotify(
    error,
    success,
    message,
    clearAdminError,
    clearAdminMessage,
    dispatch
  );

  // in edit get product details else clear the product details
  useEffect(() => {
    if (edit) {
      dispatch(getProductDetails(id));
    } else {
      dispatch(clearProductDetails());
    }
  }, [edit]);

  // if page is in edit mode then it sets the form field values
  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("category", product.category);
      setValue("images", product.images);
    }
  }, [product?.images]);

  // if url is changed then reset all the field values of form
  useEffect(() => {
    reset();
  }, [path.pathname]);

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
            selected={product?.category}
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
              accept="image/png, image/jpeg, image/webp"
              multiple
              className="hidden"
              onChange={chooseImages}
            />
          </div>
          {images.length > 0 ? (
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
                    <picture className="w-full h-55 block relative border bg-white">
                      <img
                        src={img.url || URL.createObjectURL(img)}
                        alt={img.name || img.name.split(".")[0]}
                        loading="lazy"
                        className="h-full w-full object-contain"
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
          {loading ? (
            <FillButton type="button" name={"Creating..."} />
          ) : (
            <FillButton type="submit" name={`${name.split(" ")[0]} Product`} />
          )}
        </span>
      </form>
    </div>
  );
};
