import { Link, useParams } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { category_icons } from "../../../utils/category_icons";
import { ImageCard } from "../../../components/cards/ImageCard";
import { FillButton } from "../../../components/buttons/FillButton";
import { Heading } from "../../../components/Headers/Heading";

export const SubCateogries = () => {
    const {category} = useParams()


  const categories = [
    "laptop",
    "monitor",
    "mobile",
    "tablet",
    "laptop",
    "monitor",
    "mobile",
    "tablet",
  ];
  //
  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_11fr] h-full relative">
     <Heading name={`${category}`} path={'/admin/dashboard/categories'}/>
      <div className="flex flex-col gap-y-3 overflow-y-auto p-1">
        {categories.map((subcategory, index) => {
          return (
            <Link
              to={`/admin/dashboard/categories/${category}/${subcategory}`}
              key={index}
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
                {subcategory}
              </p>
              <IoIosArrowForward className="text-2xl" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
