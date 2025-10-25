import { NavLink, useLocation } from "react-router";
import { ProductModal } from "../../../components/modal/ProductModal";
import { SearchBar } from "../../../components/Filters/SearchBar";
import { AllOutOfStockProducts } from "./AllOutOfStockProducts";
import { AllProducts } from "./AllProducts";
import { AdminProductFilter } from "../../../components/Filters/AdminProductFilter";

export const ProductNavigationTab = () => {
  const tabs = ["all", "out_of_stock"];
  const path = useLocation();
  const activeTab = path.pathname.split("/").slice(-1)[0];

  return (
    <div
      className={`h-full relative grid ${
        activeTab === "all"
          ? "grid-rows-[1fr_10fr_1fr]"
          : "grid-rows-[1fr_11fr]"
      } gap-y-1.5`}
    >
      <div>
        <div className="grid grid-cols-2 gap-2 mb-2 justify-items-center">
          {tabs.map((name, index) => {
            return (
              <NavLink
                to={`/admin/dashboard/products/${name}`}
                key={index + name}
              >
                {({ isActive }) => {
                  return (
                    <li
                      className={`${
                        isActive
                          ? "bg-[var(--purpleDark)] text-white"
                          : "bg-white border-2"
                      } border-2 border-black list-none rounded-md p-1 capitalize w-35 shrink-0 whitespace-nowrap text-center`}
                    >
                      {name.replaceAll("_", " ")}
                    </li>
                  );
                }}
              </NavLink>
            );
          })}
        </div>
        <div className="grid grid-cols-[5fr_1fr] justify-items-center">
          <SearchBar
            placeholderValue={
              activeTab === "all"
                ? "search product..."
                : "search out of product..."
            }
            path={activeTab==="all"?'/admin/dashboard/products/all':'/admin/dashboard/products/out_of_stock'}
          />
          <AdminProductFilter tab={activeTab} />
        </div>
      </div>

      {activeTab === "all" ? <AllProducts /> : <AllOutOfStockProducts />}

      {activeTab === "all" && <ProductModal />}
    </div>
  );
};
