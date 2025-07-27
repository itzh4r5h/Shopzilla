import { FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/shopzillaLogo.webp";
import {useNavigate } from "react-router";
import { BiSolidDashboard } from "react-icons/bi";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { SearchBar } from "../Filters/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../store/thunks/userThunks";

export const TopNavbar = () => {
  const navigate = useNavigate();


  const dispatch = useDispatch();
  const { isLoggedIn, user, loading, message } = useSelector(
    (state) => state.user
  );
  const isAdminUser = user?.role === "admin";

  const signout = () => {
      localStorage.clear()
      dispatch(signOutUser());
      navigate("/signin");
  };


  return (
    <nav className="grid grid-cols-[1fr_10fr_1fr] gap-3 items-center p-3 bg-white border-b-1 border-black">
      {/* logo begins */}
      <picture className="w-12 h-full block">
        <img
          src={logo}
          alt="shopzilla_logo"
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </picture>
      {/* logo ends */}

      {/* only for admin info -- dashboard heading begins */}
      {isLoggedIn && isAdminUser && (
        <h1 className="text-center text-3xl font-bold flex justify-center items-center gap-2">
          <BiSolidDashboard className="text-3xl" />
          <span>Dashboard</span>
        </h1>
      )}
      {/* only for admin info -- dashboard heading ends */}

      {/* searchbar begins */}
      {!isAdminUser && <SearchBar placeholderValue={"Search any product..."} />}
      {/* searchbar ends */}

      {/* show back button when admin user is in dashboard else show logout button begins */}
      {isLoggedIn && isAdminUser ? (
        <FaCircleArrowLeft
          className="text-2xl active:text-[var(--purpleDark)] transition-colors"
          onClick={() => navigate("/profile")}
        />
      ) : (
        isLoggedIn &&   (
          <FaSignOutAlt
            className="text-xl cursor-pointer active:text-[var(--purpleDark)] transition-color"
            onClick={signout}
          />
        )
      )}
      {/* show back button when admin user is in dashboard else show logout button ends */}
    </nav>
  );
};
