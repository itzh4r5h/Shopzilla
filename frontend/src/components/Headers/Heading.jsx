import { useNavigate } from "react-router";
import { FaCircleArrowLeft } from "react-icons/fa6";

export const Heading = ({ path, name }) => {
  const navigate = useNavigate();
  return (
    <h1 className="text-center text-3xl font-bold p-2 relative">
      {name}
      <FaCircleArrowLeft
        className="absolute top-1/2 -translate-y-1/2 left-0 text-2xl z-50 active:text-[var(--purpleDark)] transition-colors"
        onClick={() => navigate(path)}
      />
    </h1>
  );
};
