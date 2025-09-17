import { useDispatch, useSelector } from "react-redux";
import { Heading } from "../../../components/Headers/Heading";
import { useEffect } from "react";
import { getAllVariants, getProduct } from "../../../store/thunks/adminThunks";
import { useParams } from "react-router";
import {
  flatAttributesValueArray,
  formatMongodbDate,
} from "../../../utils/helpers";
import { ProductModal } from "../../../components/modal/ProductModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { VariantModal } from "../../../components/modal/VariantModal";
import { useToastNotify } from "../../../hooks/useToastNotify";
import {
  clearAdminError,
  clearAdminMessage,
} from "../../../store/slices/adminSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { ImageCard } from "../../../components/cards/ImageCard";
import { DeleteModal } from "../../../components/modal/DeleteModal";

const AttributeSlideComponent = ({ attributes }) => {
  return (
    <Swiper
      loop={attributes.length > 1 ? true : false}
      pagination={{ clickable: true }}
      grabCursor={true}
      modules={[Pagination]}
      className="mySwiper"
      spaceBetween={10}
    >
      {attributes.map((attr) => {
        return (
          <SwiperSlide key={attr._id} className="pb-8">
            <div className="grid grid-cols-[3fr_4fr] p-2 border-2 border-[var(--purpleDark)]">
              <h2 className="text-lg uppercase">{attr.name}</h2>
              <p className="text-lg capitalize text-[var(--light)] justify-self-end">
                {typeof attr.value === "string"
                  ? attr.value
                  : flatAttributesValueArray(attr.value).join(", ")}
              </p>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

const ImagesSlideComponent = ({ images }) => {
  return (
    <figure className="relative">
      <Swiper
        loop={images.length > 1 ? true : false}
        pagination={{ clickable: true }}
        grabCursor={true}
        modules={[Pagination]}
        className="mySwiper"
        spaceBetween={10}
      >
        {images.map((img) => {
          return (
            <SwiperSlide key={img._id} className="pb-7">
              <div className="border-2 border-[var(--purpleDark)] p-2">
                <div className="grid grid-cols-[3fr_4fr]">
                  <h2 className="text-lg uppercase">Color</h2>
                  <p className="text-lg capitalize text-[var(--light)] justify-self-end">
                    <input
                      type="color"
                      name="img-color"
                      id="img-color"
                      defaultValue={img.color}
                      disabled
                    />
                  </p>
                </div>

                <Swiper
                  loop={img.files.length > 1 ? true : false}
                  pagination={{ clickable: true }}
                  grabCursor={true}
                  modules={[Pagination]}
                  className="mySwiper"
                  spaceBetween={5}
                >
                  {img.files.map((pic) => {
                    return (
                      <SwiperSlide key={pic._id}>
                        <picture className="w-full block h-40 mt-2 bg-white border">
                          <ImageCard
                            src={{
                              url: pic.url,
                              name: pic.name,
                            }}
                          />
                        </picture>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </figure>
  );
};

export const SingleProductInfo = () => {
  const dispatch = useDispatch();
  const { product, attributes, error, success, message, variants, updated } =
    useSelector((state) => state.admin);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProduct(id));
    dispatch(getAllVariants(id));
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getProduct(id));
      dispatch(getAllVariants(id));
    }
  }, [updated]);

  useToastNotify(
    error,
    success,
    message,
    clearAdminError,
    clearAdminMessage,
    dispatch
  );

  return (
    <div>
      <Heading path={"/admin/dashboard/products"} name={"product details"} />

      {product ? (
        <article className="border bg-white p-2 relative mt-5">
          <h1 className="text-center text-2xl mb-3">Base Product</h1>
          <span className="absolute top-3 right-2">
            <ProductModal edit={true} product={product} />
          </span>

          <div className="flex flex-col justify-center gap-y-2">
            {[
              ...Object.keys(product).filter(
                (key) =>
                  key !== "_id" &&
                  key !== "__v" &&
                  key !== "updatedAt" &&
                  key !== "user"
              ),
            ].map((key, index) => {
              return (
                <div className="grid grid-cols-[3fr_4fr]" key={index}>
                  <h2 className="text-lg uppercase">
                    {key === "reviewsCount"
                      ? "Reviews"
                      : key === "createdAt"
                      ? "Created on"
                      : key}
                  </h2>
                  <p className="text-lg capitalize text-[var(--light)]">
                    {key === "category"
                      ? product[key].name
                      : key === "createdAt"
                      ? formatMongodbDate(product[key])
                      : product[key]}
                  </p>
                </div>
              );
            })}
          </div>
        </article>
      ) : (
        <article className="border bg-white p-2 relative mt-5">
          <h1 className="text-center text-2xl mb-3">
            <Skeleton width={"60%"} />
          </h1>
          <span className="absolute top-3 right-2">
            <Skeleton height={20} width={20} />
          </span>

          <div className="flex flex-col justify-center gap-y-2">
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">
                <Skeleton width={"90%"} />
              </h2>
              <p className="text-lg capitalize text-[var(--light)]">
                <Skeleton />
              </p>
            </div>
          </div>
        </article>
      )}

      {attributes?.length > 0 ? (
        <div className="grid grid-cols-2 items-center mt-5">
          <h1 className="font-semibold text-3xl">Variants</h1>
          <VariantModal id={id} attributesData={attributes} />
        </div>
      ) : (
        <div className="grid grid-cols-2 items-center gap-3 mt-5">
          <h1 className="font-semibold text-3xl">
            <Skeleton height={50} />
          </h1>
          <Skeleton height={50} />
        </div>
      )}

      {variants?.length > 0 ? (
        <Swiper
          loop={variants.length > 1 ? true : false}
          pagination={{ clickable: true }}
          grabCursor={true}
          modules={[Pagination]}
          className="mySwiper"
          spaceBetween={10}
        >
          {variants.map((variant) => {
            return (
              <SwiperSlide key={variant._id} className="pb-8">
                <article className="border bg-white p-2 relative mt-5">
                  <h1 className="text-2xl mb-3">Details</h1>

                  <span className="absolute top-2 right-2">
                    <div className="flex items-center justify-center gap-2">
                      <VariantModal
                        edit={true}
                        id={id}
                        attributesData={attributes}
                        variant={variant}
                      />
                      <DeleteModal />
                    </div>
                  </span>

                  <div className="flex flex-col justify-center gap-y-2">
                    <div className="grid grid-cols-[3fr_4fr]">
                      <h2 className="text-lg uppercase">Price</h2>
                      <p className="text-lg capitalize text-[var(--light)] justify-self-end">
                        {variant.price}
                      </p>
                    </div>
                    <div className="grid grid-cols-[3fr_4fr]">
                      <h2 className="text-lg uppercase">Stock</h2>
                      <p className="text-lg capitalize text-[var(--light)] justify-self-end">
                        {variant.stock}
                      </p>
                    </div>
                    <h1 className="text-2xl mt-2">Attributes</h1>
                    <div className="grid w-full">
                      <AttributeSlideComponent
                        attributes={variant.attributes}
                      />
                    </div>
                    <h1 className="text-2xl -mt-4">Images</h1>

                    <ImagesSlideComponent images={variant.images} />
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <article className="border bg-white p-2 relative mt-5">
          <p className="text-center text-lg">No Variants exists yet</p>
        </article>
      )}
    </div>
  );
};
