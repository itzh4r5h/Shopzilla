import { Link } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { category_icons } from "../../../utils/category_icons";
import { ImageCard } from "../../../components/cards/ImageCard";
import { CategoryModal } from "../../../components/modal/CategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCaetgories } from "../../../store/thunks/categoryThunk";

export const Categories = () => {
  const dispatch = useDispatch();
  const { error, success, message, categories, loading } = useSelector(
    (state) => state.category
  );

  useEffect(()=>{
    dispatch(getAllCaetgories())
  },[])

  return (
    <div className="grid gap-y-1 grid-cols-1 grid-rows-[1fr_11fr] h-full relative">
      <h1 className="text-2xl text-center font-semibold">Categories</h1>
      {!loading && categories?.length > 0 && (
        <>
          {" "}
          <div className="flex flex-col gap-y-3 overflow-y-auto p-1 pb-10">
            {categories.map((category, index) => {
              return (
                <Link
                  to={`/admin/dashboard/categories/${category.name}/${category._id}`}
                  key={category._id}
                  className="bg-white border rounded-md h-17 p-2 grid items-center grid-cols-[2fr_9fr_1fr] gap-x-3 active:border-[var(--purpleDark)] active:ring-2 active:ring-[var(--purpleDark)]"
                >
                  <picture className="relative h-10 w-full block overflow-hidden">
                    <ImageCard
                      src={{
                        url: category_icons["apple"],
                        name: "apple",
                      }}
                    />
                  </picture>

                  <p className="text-lg leading-tight tracking-wider uppercase">
                    {category.name}
                  </p>
                  <IoIosArrowForward className="text-2xl" />
                </Link>
              );
            })}
          </div>
          <span className="px-1 absolute -bottom-4 w-full">
            <CategoryModal />
          </span>
        </>
      )}

       {!loading && categories?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No Categories Yet
        </p>
      )}
    </div>
  );
};
