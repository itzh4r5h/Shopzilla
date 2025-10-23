import { useEffect, useRef } from "react";
import { BottomNavbar } from "./components/navbar/BottomNavbar";
import { TopNavbar } from "./components/navbar/TopNavbar";
import { Routing } from "./utils/Routing";
import { Bounce, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "./css/toastifyCustom.css";
import { loadUser } from "./store/thunks/non_admin/userThunk";
import { startSocketConnection } from "./utils/socketEvents";
import { useLocation, useNavigate } from "react-router";
import { useGlobalAlert } from "./hooks/useGlobalAlert";

export const App = () => {
  const mainRef = useRef();
  const navigate = useNavigate();
  const path = useLocation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useGlobalAlert(); // globally listens and triggers toast

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload(); // 🔄 Auto reload when online
    };

    window.addEventListener("online", handleOnline);
    if (!isLoggedIn) {
      dispatch(loadUser());
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    mainRef.current.scrollTo({
      top: 0,
    });
  }, [path.pathname]);

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      startSocketConnection(user?._id, dispatch);
    }
  }, [isLoggedIn, user?._id]);

  useEffect(() => {
    if (!loading && isLoggedIn && user) {
      if (!user.isVerified) {
        navigate("/profile");
      }
    }
  }, [loading, isLoggedIn, user, path.pathname]);

  return (
    <>
      <div className="hidden sm:grid sm:place-content-center sm:h-full sm:w-full sm:text-7xl sm:text-center sm:px-10">
        Currenlty only availalbe on mobile devices 🙂
      </div>
      <div className="h-full w-full grid grid-rows-[1fr_10fr_1fr] bg-[var(--grey)] sm:hidden">
        <TopNavbar />
        <main className="px-4 pt-3 pb-0 overflow-y-auto relative" ref={mainRef}>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            limit={4}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={true}
            theme="colored"
            transition={Bounce}
          />
          <Routing />
        </main>
        <BottomNavbar />
      </div>
    </>
  );
};
