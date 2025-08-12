import { useEffect, useRef } from "react";
import { BottomNavbar } from "./components/navbar/BottomNavbar";
import { TopNavbar } from "./components/navbar/TopNavbar";
import { Routing } from "./utils/Routing";
import { Bounce, ToastContainer } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import './css/toastifyCustom.css';
import { loadUser } from "./store/thunks/userThunks";
import { startSocketConnection } from "./utils/socketEvents";

export const App = () => {
  const mainRef = useRef();
  const dispatch = useDispatch()
  const {isLoggedIn,user} = useSelector((state)=>state.user)

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload(); // 🔄 Auto reload when online
    };

    window.addEventListener("online", handleOnline);
   if(!isLoggedIn){
     dispatch(loadUser())
   }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);


  useEffect(()=>{
    if(isLoggedIn && user.role === 'admin'){
      startSocketConnection(user._id,dispatch)
    }
  },[isLoggedIn,user?._id])

  return (
    <div className="h-full w-full grid grid-rows-[1fr_10fr_1fr] bg-[var(--grey)]">
      <TopNavbar />
      <main className="p-4 overflow-y-auto relative" ref={mainRef}>
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
        <Routing mainRef={mainRef} />
      </main>
      <BottomNavbar />
    </div>
  );
};
