import { Link } from "react-router";
import { ProductCard } from "../../components/cards/ProductCard";
import { TitleWithSearchBar } from "../../components/Headers/TitleWithSearchBar";

export const AllProducts = () => {
  const adminDefaultPath = '/admin/dashboard'
  return (
    <div>
      <TitleWithSearchBar
        title={"Products"}
        placeholderValue={"search any product..."}
      />

      <div className="grid grid-cols-2 gap-5 mt-4">
        {[1, 1, 1, 1, 1, 1, 1].map((item, index) => {
          return (
            <div key={index} className="relative">
              <Link to={`${adminDefaultPath}/products/${index}`}>
                <ProductCard />
              </Link>
             <Link to={`${adminDefaultPath}/products/${index}/update`} className="absolute -top-1 -right-1 z-100">
              <button className="bg-[var(--purpleDark)] text-white text-sm px-2 py-0.5 rounded-sm">
                Edit
              </button>
             </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
