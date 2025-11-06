import { Link, useParams } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { category_icons } from "../../../utils/category_icons";
import { ImageCard } from "../../../components/cards/ImageCard";
import { Heading } from "../../../components/Headers/Heading";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteSubCategory,
  getAllSubCaetgories,
} from "../../../store/thunks/admin/categoryThunk";
import { DeleteModal } from "../../../components/modal/DeleteModal";
import { CategoryNameModal } from "../../../components/modal/CategoryNameModal";
import { SubCategoryModal } from "../../../components/modal/SubCategoryModal";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SubCateogries = () => {
  const { category, id } = useParams();
  const dispatch = useDispatch();
  const { subcategories, loading, updated } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getAllSubCaetgories(id));
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllSubCaetgories(id));
    }
  }, [updated]);

  return (
    <div className="grid gap-y-1 grid-cols-1 grid-rows-[1fr_10fr_1fr] h-full relative">
      <Heading name={`${category}`} path={"/admin/dashboard/categories"} />
      {!loading && subcategories?.length > 0 && (
        <div className="flex flex-col gap-y-3 overflow-y-auto pb-1">
          {subcategories.map((subcategory) => {
            return (
              <div className="relative" key={subcategory._id}>
                <div className="absolute right-1 top-1 flex flex-col justify-center items-center gap-2">
                  <CategoryNameModal
                    name={subcategory.name}
                    icon={subcategory.icon}
                    subId={subcategory._id}
                    id={id}
                  />

                  <DeleteModal
                    deleteFunction={() => {
                      dispatch(
                        deleteSubCategory({ id, subId: subcategory._id })
                      );
                    }}
                    textSize={"text-3xl"}
                  />
                </div>
                <Link
                  to={`/admin/dashboard/categories/${category}/${id}/${subcategory.name}/${subcategory._id}`}
                  className="bg-white border rounded-md h-17 p-2 grid items-center grid-cols-[2fr_8.5fr_1fr_.5fr] gap-x-3 active:border-[var(--purpleDark)] active:ring-2 active:ring-[var(--purpleDark)]"
                >
                  <picture className="relative h-10 w-full block overflow-hidden">
                    <ImageCard
                      src={{
                        url: category_icons[subcategory.icon],
                        name: subcategory.icon,
                      }}
                    />
                  </picture>

                  <p className="text-lg leading-tight tracking-wider uppercase">
                    {subcategory.name}
                  </p>
                  <IoIosArrowForward className="text-2xl" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-y-3 overflow-y-auto pb-1">
          {[1, 2, 3, 4, 5].map((data) => {
            return (
              <div className="relative" key={data}>
                <div className="absolute right-1 top-1 flex flex-col justify-center items-center gap-2">
                  <Skeleton height={20} width={20} />
                  <Skeleton height={20} width={20} />
                </div>

                <div className="bg-white border rounded-md h-17 p-2 grid items-center grid-cols-[2fr_8.5fr_1fr_.5fr] gap-x-3 active:border-[var(--purpleDark)] active:ring-2 active:ring-[var(--purpleDark)]">
                  <picture className="relative h-10 w-full block overflow-hidden">
                    <Skeleton height={"100%"} />
                  </picture>

                  <p className="text-lg leading-tight tracking-wider uppercase">
                    <Skeleton />
                  </p>
                  <Skeleton height={25} width={20} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SubCategoryModal id={id} />
    </div>
  );
};
