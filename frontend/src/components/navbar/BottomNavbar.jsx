import { NavLink, useLocation } from "react-router";
import { FaHouse, FaBagShopping, FaBoxOpen, FaUser } from "react-icons/fa6";
import { FaPlusSquare } from "react-icons/fa";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { FaSignInAlt } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const BottomNavbar = () => {
  const path = useLocation();

  const adminDefaultPath = "/admin/dashboard";
  const { isLoggedIn, user, loading } = useSelector((state) => state.user);
  const isAdminUser = user?.role === "admin";

  const userRoutes = [
    { path: "/", name: "home", icon: <FaHouse /> },
    { path: "/cart", name: "cart", icon: <FaBagShopping /> },
    { path: "/orders", name: "orders", icon: <FaBoxOpen /> },
    { path: "/profile", name: "profile", icon: <FaUser /> },
  ];

  const nonProtectedRoutes = [
    { path: "/", name: "home", icon: <FaHouse /> },
    {
      path: "/reset/password",
      name: "reset password",
      icon: <PiPasswordFill />,
    },
    { path: "/signin", name: "signin", icon: <FaSignInAlt /> },
    { path: "/signup", name: "signup", icon: <FaUser /> },
  ];

  const adminRoutes = [
    {
      path: `${adminDefaultPath}/home`,
      name: "home",
      icon: <FaHouse />,
    },
    {
      path: `${adminDefaultPath}/users`,
      name: "users",
      icon: <FaUser />,
    },
    {
      path: `${adminDefaultPath}/orders/confirmed`,
      name: "orders",
      icon: <FaBoxOpen />,
    },
    {
      path: `${adminDefaultPath}/product/new`,
      name: "add",
      icon: <FaPlusSquare />,
    },
    {
      path: `${adminDefaultPath}/products`,
      name: "products",
      icon: <BsFillBoxSeamFill />,
    },
  ];

  return (
    <nav className="px-4 py-2">
      {loading ? (
        <ul className="border border-[var(--black)] rounded-2xl bg-[var(--white)] w-full p-2 flex justify-around items-center gap-3">
          <Skeleton height={36} width={44} />
          <Skeleton height={36} width={44} />
          <Skeleton height={36} width={44} />
          <Skeleton height={36} width={44} />
        </ul>
      ) : (
        <ul className="border border-[var(--black)] rounded-2xl bg-[var(--white)] w-full p-2 flex justify-around items-center gap-5">
          {/* navigation for not logged in users */}
          {!isLoggedIn &&
            nonProtectedRoutes.map((menu, index) => {
              return (
                <li key={index}>
                  <NavLink
                    to={menu.path}
                    className="flex flex-col items-center justify-center"
                  >
                    {({ isActive }) => {
                      return (
                        <>
                          <span
                            className={`text-xl ${
                              isActive
                                ? "text-[var(--purpleDark)]"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.icon}
                          </span>
                          <span
                            className={`text-sm capitalize ${
                              isActive
                                ? "text-[var(--purpleDark)] font-bold"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.name}
                          </span>
                        </>
                      );
                    }}
                  </NavLink>
                </li>
              );
            })}

          {/* navigation for logged in user */}
          {isLoggedIn &&
            !path.pathname.includes("/admin/dashboard/") &&
            userRoutes.map((menu, index) => {
              return (
                <li key={index}>
                  <NavLink
                    to={menu.path}
                    className="flex flex-col items-center justify-center"
                  >
                    {({ isActive }) => {
                      return (
                        <>
                          <span
                            className={`text-xl ${
                              isActive ||
                              (path.pathname.includes("/products") &&
                                index === 0) ||
                              (path.pathname.includes("/orders") && index === 2)
                                ? "text-[var(--purpleDark)]"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.icon}
                          </span>
                          <span
                            className={`text-sm capitalize ${
                              isActive ||
                              (path.pathname.includes("/products") &&
                                index === 0) ||
                              (path.pathname.includes("/orders") && index === 2)
                                ? "text-[var(--purpleDark)] font-bold"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.name}
                          </span>
                        </>
                      );
                    }}
                  </NavLink>
                </li>
              );
            })}

          {/* navigation for admin user dashboard */}
          {isLoggedIn &&
            isAdminUser &&
            path.pathname.includes("/admin/dashboard/") &&
            adminRoutes.map((menu, index) => {
              return (
                <li key={index}>
                  <NavLink
                    to={menu.path}
                    className="flex flex-col items-center justify-center"
                  >
                    {({ isActive }) => {
                      return (
                        <>
                          <span
                            className={`text-xl ${
                              isActive ||
                              (index === 2 &&
                                path.pathname.includes(
                                  `${adminDefaultPath}/orders/`
                                ))
                                ? "text-[var(--purpleDark)]"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.icon}
                          </span>
                          <span
                            className={`text-sm capitalize ${
                              isActive ||
                              (index === 2 &&
                                path.pathname.includes(
                                  `${adminDefaultPath}/orders/`
                                ))
                                ? "text-[var(--purpleDark)] font-bold"
                                : "text-[var(--light)]"
                            }`}
                          >
                            {menu.name}
                          </span>
                        </>
                      );
                    }}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      )}
    </nav>
  );
};
