import { Link } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { category_icons } from "../../../utils/category_icons";
import { ImageCard } from "../../../components/cards/ImageCard";
import { CategoryModal } from "../../../components/modal/CategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteCategory,
  getAllCaetgories,
} from "../../../store/thunks/categoryThunk";
import { useToastNotify } from "../../../hooks/useToastNotify";
import {
  clearCategoryError,
  clearCategoryMessage,
} from "../../../store/slices/categorySlice";
import { CategoryNameModal } from "../../../components/modal/CategoryNameModal";
import { DeleteModal } from "../../../components/modal/DeleteModal";

export const Categories = () => {
  const dispatch = useDispatch();
  const { error, success, message, categories, loading, updated } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getAllCaetgories());
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllCaetgories());
    }
  }, [updated]);

  useToastNotify(
    error,
    success,
    message,
    clearCategoryError,
    clearCategoryMessage,
    dispatch
  );

  return (
    <div className="grid gap-y-1 grid-cols-1 grid-rows-[1fr_10fr_1fr] h-full relative">
      <h1 className="text-2xl text-center font-semibold">Categories</h1>
      {!loading && categories?.length > 0 && (
        <div className="flex flex-col gap-y-3 overflow-y-auto pb-1">
          {categories.map((category) => {
            return (
              <div className="relative" key={category._id}>
                <div className="absolute right-1 top-1 flex flex-col justify-center items-center gap-2">
                  <CategoryNameModal
                    name={category.name}
                    icon={category.icon}
                    id={category._id}
                  />

                  <DeleteModal
                    deleteFunction={() => {
                      dispatch(deleteCategory(category._id));
                    }}
                    classes={
                      "text-3xl active:text-[var(--purpleDark)] transition-colors"
                    }
                  />
                </div>

                <Link
                  to={`/admin/dashboard/categories/${category.name}/${category._id}`}
                  className="bg-white border rounded-md h-17 p-2 grid items-center grid-cols-[2fr_8.5fr_1fr_.5fr] gap-x-3 active:border-[var(--purpleDark)] active:ring-2 active:ring-[var(--purpleDark)]"
                >
                  <picture className="relative h-10 w-full block overflow-hidden">
                    <ImageCard
                      src={{
                        url: category_icons[category.icon],
                        name: category.icon,
                      }}
                    />
                  </picture>

                  <p className="text-lg leading-tight tracking-wider uppercase">
                    {category.name}
                  </p>
                  <IoIosArrowForward className="text-2xl" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {!loading && categories?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Categories Yet
        </p>
      )}

      <CategoryModal />
    </div>
  );
};
