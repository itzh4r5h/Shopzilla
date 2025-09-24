import { useNavigate } from "react-router";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { ProudctFilter } from "../Filters/ProudctFilter";

export const Heading = ({ path, name, icon=false,iconComponent }) => {
  const navigate = useNavigate();
  return (
    <h1 className="text-center text-3xl font-bold p-2 relative capitalize px-8">
      {name}
      <FaCircleArrowLeft
        className="absolute top-1/2 -translate-y-1/2 left-0 text-2xl z-50 active:text-[var(--purpleDark)] transition-colors"
        onClick={() => navigate(path)}
      />
      {icon && <span className="absolute top-1/2 -translate-y-1/2 right-0 z-50">
        {iconComponent}
      </span> }
    </h1>
  );
};
