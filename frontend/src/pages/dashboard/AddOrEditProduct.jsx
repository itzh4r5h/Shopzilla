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
import { useState } from "react";
import { NormalSelect } from "../../components/selectors/NormalSelect";

export const AddOrEditProduct = ({ edit = false, name }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(null);
  const categories = ["mobile","laptop","shirt","jeans","earphone","headphone","earbuds"]

  const chooseImages = (e) => {
    const selectedImages = Array.from(e.target.files);

    // Optional: filter only jpg/png files
    const validImages = selectedImages.filter(
      (file) => file.type === "image/png" || file.type === "image/jpeg"
    );

    setImages((prev) => [...prev, ...validImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      return prev.filter((img, i) => i !== index);
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
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
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none"
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
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none resize-none h-50"
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
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none"
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
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none"
          />
        </div>
        {/* stock ends */}

        {/* category begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="category" className="text-xl w-fit">
            Category
          </label>
          <NormalSelect idForLabel={"category"} defaultValue={"select category"} option={category} setOption={setCategory} optionsData={categories} />
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
                    <picture className="w-full h-55 block relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name.split(".")[0]}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <FaTimesCircle
                        className="self-end text-2xl absolute top-2 right-2 z-100"
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
          <FillButton name={name.split(" ")[0]+" Product"} />
        </span>
      </form>
    </div>
  );
};
