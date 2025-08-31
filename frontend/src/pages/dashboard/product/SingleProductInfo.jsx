import { useDispatch, useSelector } from "react-redux";
import { Heading } from "../../../components/Headers/Heading";
import { useEffect } from "react";
import { getProduct } from "../../../store/thunks/adminThunks";
import { useParams } from "react-router";
import { formatMongodbDate } from "../../../utils/helpers";
import { CreateOrUpdateProductModal } from "../../../components/modal/CreateOrUpdateProductModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CreateOrUpdateVariantModal } from "../../../components/modal/CreateOrUpdateVariantModal";

export const SingleProductInfo = () => {
  const dispatch = useDispatch();
  const { product, attributes } = useSelector((state) => state.admin);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProduct(id));
  }, []);

  return (
    <div>
      <Heading path={"/admin/dashboard/products"} name={"product details"} />

      {product ? (
        <article className="border bg-white p-2 relative mt-5">
          <h1 className="text-center text-2xl mb-3">Base Product</h1>
          <span className="absolute top-3 right-2">
            <CreateOrUpdateProductModal edit={true} />
          </span>

          <div className="flex flex-col justify-center gap-y-2">
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Name</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.name}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Description</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.description}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Brand</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.brand}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Category</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.category.name}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Subcategory</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.subcategory}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Ratings</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.ratings}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Reviews</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {product.reviewsCount}
              </p>
            </div>
            <div className="grid grid-cols-[3fr_4fr]">
              <h2 className="text-lg uppercase">Created on</h2>
              <p className="text-lg capitalize text-[var(--light)]">
                {formatMongodbDate(product.createdAt)}
              </p>
            </div>
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

      {attributes?.length > 0 && (
        <div className="mt-5">
          <div className="grid grid-cols-2 items-center">
            <h1 className="font-semibold text-3xl">Variants</h1>
            <CreateOrUpdateVariantModal
              attributesData={attributes}
              category={product.subcategory}
              isColorExistsAndTypeIsArray={Boolean(attributes.find((attr)=>attr.name.toLowerCase()==='color' && attr.type === 'enum'))}
            />
          </div>
          {console.log()}
          <article className="border bg-white p-2 relative mt-5"></article>
        </div>
      )}
    </div>
  );
};
