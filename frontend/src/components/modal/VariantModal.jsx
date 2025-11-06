import { FaMinusCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { MdEditSquare, MdOutlineFileUpload } from "react-icons/md";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { ImageCard } from "../cards/ImageCard";
import { variantJoiSchema } from "../../validators/productValidators";
import { cleanAttributes, deepLowercase } from "../../utils/helpers";
import { addOrUpdateVariant } from "../../store/thunks/admin/variantThunk";
import { CustomSwiperSlider } from "../common/CustomSwiperSlider";
import { CustomDialog } from "../common/CustomDialog";

const SizeSlideComponenet = ({
  index,
  sizes,
  imgIndex,
  register,
  removeSize,
  addSize,
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-2 relative">
      {sizes.length > 1 && (
        <div className="flex items-center absolute top-2 right-0 gap-x-2">
          <FaMinusCircle
            className="text-xl active:text-[var(--purpleDark)] transition-colors"
            onClick={() => removeSize(index)}
          />
          {index + 1 === sizes.length && (
            <FaPlusCircle
              className="text-xl active:text-[var(--purpleDark)] transition-colors"
              onClick={() => addSize({ size: "", stock: 0 })}
            />
          )}
        </div>
      )}

      {sizes.length < 2 && (
        <FaPlusCircle
          className="text-xl active:text-[var(--purpleDark)] transition-colors absolute top-2 right-0"
          onClick={() => addSize({ size: "", stock: 0 })}
        />
      )}

      {/* size begins */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor={`images.${imgIndex}.sizes.${index}.size`}
          className="text-xl w-fit"
        >
          Size
        </label>
        <input
          autoComplete="off"
          {...register(`images.${imgIndex}.sizes.${index}.size`, {
            required: true,
          })}
          id={`images.${imgIndex}.sizes.${index}.size`}
          className="uppercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
        />
      </div>
      {/* size ends */}
      {/* stock begins */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor={`images.${imgIndex}.sizes.${index}.stock`}
          className="text-xl w-fit"
        >
          Stock
        </label>
        <input
          autoComplete="off"
          {...register(`images.${imgIndex}.sizes.${index}.stock`, {
            required: true,
          })}
          id={`images.${imgIndex}.sizes.${index}.stock`}
          className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
        />
      </div>
      {/* stock ends */}
    </div>
  );
};

const SizesComponent = ({ childRefs, control, imgIndex, register }) => {
  // For attributes inside each subcategory
  const {
    fields: sizes,
    append: addSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `images.${imgIndex}.sizes`,
  });

  return (
    <CustomSwiperSlider
      swiperRef={childRefs}
      slideData={sizes}
      className="sizes_swiper"
      isParentSlide={false}
      pb="pb-10 px-2"
      isChildRef={true}
      i={imgIndex}
      nested={true}
    >
      <SizeSlideComponenet
        sizes={sizes}
        register={register}
        addSize={addSize}
        removeSize={removeSize}
        imgIndex={imgIndex}
      />
    </CustomSwiperSlider>
  );
};

const ImagesSlideComponent = ({
  index,
  images,
  handleRemoveImagesBox,
  addImagesBox,
  needSize,
  register,
  control,
  childRefs,
  chooseImages,
  data: imgData,
  removeImage,
}) => {
  const color = `images.${index}.color`;
  const price = `images.${index}.price`;
  const stock = `images.${index}.stock`;
  const fileName = `images.${index}.files`;

  return (
    <div
      className={`grid gap-y-3 border-2 border-[var(--purpleDark)] p-2 rounded-md relative`}
      key={index}
    >
      {images.length > 1 && (
        <div className="flex items-center absolute top-2 right-2 gap-x-2">
          <FaMinusCircle
            className="text-xl active:text-[var(--purpleDark)] transition-colors"
            onClick={() => handleRemoveImagesBox(index, images)}
          />
          {index + 1 === images.length && (
            <FaPlusCircle
              className="text-xl active:text-[var(--purpleDark)] transition-colors"
              onClick={() =>
                addImagesBox({
                  color: "#000000",
                  price: 0,
                  ...(needSize
                    ? { sizes: [{ size: "", stock: 0 }] }
                    : { stock: 0 }),
                  files: [],
                })
              }
            />
          )}
        </div>
      )}

      {images.length < 2 && (
        <FaPlusCircle
          className="text-xl active:text-[var(--purpleDark)] transition-colors absolute top-2 right-2"
          onClick={() =>
            addImagesBox({
              color: "#000000",
              price: 0,
              ...(needSize
                ? { sizes: [{ size: "", stock: 0 }] }
                : { stock: 0 }),
              files: [],
            })
          }
        />
      )}

      <div className="grid grid-cols-2 gap-x-2">
        <label htmlFor={color} className="text-xl w-fit">
          Color
        </label>
        <input
          type="color"
          autoComplete="off"
          {...register(color, {
            required: true,
          })}
          id={color}
          className="h-full w-20"
        />
      </div>

      {/* price begins */}
      <div className="grid grid-cols-2 gap-x-2">
        <label htmlFor={price} className="text-xl w-fit">
          Price
        </label>
        <input
          type="number"
          autoComplete="off"
          {...register(price, { required: true })}
          id={price}
          className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
        />
      </div>
      {/* price ends */}

      {/* stock begins */}
      {!needSize && (
        <div className="grid grid-cols-2 gap-x-2 mb-4">
          <label htmlFor={stock} className="text-xl w-fit">
            Stock
          </label>
          <input
            type="number"
            autoComplete="off"
            {...register(stock, { required: true })}
            id={stock}
            className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
        </div>
      )}
      {/* stock ends */}

      {needSize && (
        <div>
          <h1 className="capitalize text-2xl">Sizes</h1>

          <SizesComponent
            childRefs={childRefs}
            imgIndex={index}
            control={control}
            register={register}
          />
        </div>
      )}

      {/* images box begins */}
      <div className="flex flex-col items-center justify-center gap-2 -mt-4">
        {/* images label and choose images begins */}
        <div className="grid grid-cols-2 items-center w-full">
          <h1 className="capitalize text-xl">Images</h1>
          <label
            htmlFor={fileName}
            className="justify-self-end flex justify-center items-center bg-[var(--purpleDark)] text-white py-1 px-2 gap-1 rounded-md"
          >
            <MdOutlineFileUpload className="text-lg" />
            <span className="text-md">Choose</span>
          </label>
          <input
            type="file"
            {...register(fileName, { required: true })}
            name={fileName}
            id={fileName}
            accept="image/png, image/jpeg, image/webp"
            multiple
            className="hidden"
            onChange={(e) => chooseImages(e, fileName)}
          />
        </div>
        {/* images label and choose images ends */}

        {/* images preview begins */}
        <div className="grid w-full">
          {imgData.files.length > 0 ? (
            <Swiper
              loop={imgData.files.length > 1 ? true : false}
              pagination={{ clickable: true }}
              grabCursor={true}
              modules={[Pagination]}
              className="mySwiper5"
              spaceBetween={5}
              nested={true}
            >
              {imgData.files.map((img, imgIndex) => {
                return (
                  <SwiperSlide key={imgIndex}>
                    <picture className="w-full h-55 block relative border bg-white">
                      <ImageCard
                        src={{
                          url: img.url || URL.createObjectURL(img),
                          name: img.name || img.name.split(".")[0],
                        }}
                      />
                      <FaTimesCircle
                        className="self-end text-2xl absolute top-2 right-2 z-100 text-[var(--purpleDark)]"
                        onClick={() => {
                          removeImage(index, imgIndex);
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
        {/* images preview begins */}
      </div>
      {/* images box begins */}
    </div>
  );
};

export const VariantModal = ({
  edit = false,
  variant = undefined,
  attributesData = [],
  id,
  needSize = false,
}) => {
  const schema = useMemo(() => {
    return variantJoiSchema;
  }, []);

  const getDefaultValues = (attributesData, variant) => {
    if (variant) {
      // Editing existing variant
      const attrs = cleanAttributes(variant.attributes);

      // in case of new attributes addition
      const extraAttributes = attributesData
        .filter(
          (attr) => !attrs.some((variantAttr) => variantAttr.name === attr.name)
        )
        .map(({ name }) => ({ name, value: "" }));

      // if found then add it to attrs
      if (extraAttributes.length > 0) {
        attrs.push(...extraAttributes);
      }

      return {
        attributes: attrs,
        needSize: variant.needSize,
        images: variant.images.map(({ _id, ...rest }) => ({
          color: rest.color,
          price: rest.price,
          ...(variant.needSize
            ? { sizes: rest.sizes.map(({ _id, ...restSize }) => restSize) }
            : { stock: rest.stock }),
          files: rest.files.map(({ _id, ...fileRest }) => fileRest),
        })),
      };
    }

    // Creating new variant
    return {
      attributes: [
        ...attributesData.map((attr) => ({
          name: attr.name,
          value: "",
        })),
      ],
      needSize: needSize,
      images: [
        {
          color: "#000000",
          price: 0,
          ...(needSize ? { sizes: [{ size: "", stock: 0 }] } : { stock: 0 }),
          files: [],
        },
      ],
    };
  };

  const dispatch = useDispatch();
  const [removedImagesFileIds, setRemovedImagesFileIds] = useState([]);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(attributesData, variant),
    resolver: joiResolver(schema),
  });

  const { append: addImagesBox, remove: removeImagesBox } = useFieldArray({
    control,
    name: "images",
  });

  const images = watch("images");

  const { fields: attributes } = useFieldArray({
    control,
    name: "attributes",
  });

  const chooseImages = (e, fileName) => {
    const selectedImages = Array.from(e.target.files);
    // Optional: filter only jpg/png/webp files
    const validImages = selectedImages.filter(
      (file) =>
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/webp"
    );

    // Get existing images from that index
    const prevImages = getValues(fileName) || [];

    // Append new ones
    setValue(fileName, [...prevImages, ...validImages], {
      shouldValidate: true,
    });
  };

  const removeImage = (index, imgIndex) => {
    setValue(
      `images.${index}.files`,
      images[index].files.filter((img, i) => {
        if (i === imgIndex) {
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

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    const { images, ...rest } = data;
    const variantData = deepLowercase(rest);
    variantData.images = images;
    if (edit) {
      variantData.removedImagesFileIds = removedImagesFileIds;
      dispatch(
        addOrUpdateVariant({
          edit: true,
          variant: variantData,
          id,
          variantId: variant._id,
        })
      );
    } else {
      dispatch(addOrUpdateVariant({ variant: variantData, id }));
    }
    setRemovedImagesFileIds([]);
    handleClose();
  };

  useEffect(() => {
    reset(getDefaultValues(attributesData, variant));
  }, [attributesData, reset, variant]);

  const handleRemoveImagesBox = (index, images) => {
    if (edit) {
      images[index].files.forEach((file) => {
        if (file.fileId) {
          setRemovedImagesFileIds((prev) => [...prev, file.fileId]);
        }
      });
    }
    removeImagesBox(index);
  };

  const swiperRef = useRef(null);
  const childSwiperRefs = useRef([]);

  useValidationErrorToast(errors, { main: swiperRef, childs: childSwiperRefs });

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        {edit ? (
          <MdEditSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
        ) : (
          <FillButton type="button" name={"Add variant"} />
        )}
      </span>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={"Variant Details"}
      >
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col justify-center gap-5"
        >
          {/* attributes begins */}
          <div className="flex flex-col justify-center gap-y-2">
            <h1 className="text-2xl">Attributes</h1>
            {attributes.map((attr, index) => {
              const attrName = `attributes.${index}.name`;
              const attrValue = `attributes.${index}.value`;

              return (
                <div
                  className="flex flex-col justify-center gap-y-2"
                  key={attr.id}
                >
                  <div className="grid grid-cols-2 gap-x-2">
                    <input
                      autoComplete="off"
                      {...register(attrName, {
                        required: true,
                      })}
                      id={attrName}
                      readOnly
                      className="uppercase text-lg outline-none pointer-events-none"
                    />

                    <input
                      autoComplete="off"
                      {...register(attrValue, {
                        required: true,
                      })}
                      id={attrValue}
                      className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* attributes ends */}

          {/* images begins */}
          <CustomSwiperSlider
            swiperRef={swiperRef}
            slideData={images}
            className="options_swiper"
            pb="pb-10"
          >
            <ImagesSlideComponent
              images={images}
              needSize={needSize}
              register={register}
              childRefs={childSwiperRefs}
              chooseImages={chooseImages}
              handleRemoveImagesBox={handleRemoveImagesBox}
              addImagesBox={addImagesBox}
              removeImage={removeImage}
              control={control}
            />
          </CustomSwiperSlider>

          {/* images ends */}

          <FillButton
            type="submit"
            name={edit ? "Update" : "Add"}
            padding="px-2 py-1 -mt-4"
          />
        </form>
      </CustomDialog>
    </div>
  );
};
