import { FaEdit } from "react-icons/fa";
import { OutlineButton } from "../components/buttons/OutlineButton";
import { FaCheckSquare } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa";
import { AddressModal } from "../components/modal/AddressModal";
import { FillButton } from "../components/buttons/FillButton";
import { FaCheck } from "react-icons/fa";
import { Link, useNavigate, useParams,useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearErrors, clearMessage } from "../store/slices/userSlice";
import { ImageCard } from "../components/cards/ImageCard";
import Tooltip from "@mui/material/Tooltip";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  loadUser,
  sendEmailVerificationLink,
  signOutUser,
  verifyEmail,
} from "../store/thunks/userThunks";
import { useSyncedCountdown } from "../hooks/useSyncedCountdown";

export const Profile = () => {
  const isEdit = false;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const googleUser = searchParams.get('google_user')

  const {
    error,
    success,
    message,
    user,
    loading,
    sending,
    accountDeletionCountdownExpiresAt,
    resendLinkIn,
  } = useSelector((state) => state.user);

  const isAdminUser = user?.role === "admin";

  const resendCountdown = useSyncedCountdown(`resend_timer_${user?._id}`, 0);
  const deletionCountdown = useSyncedCountdown(
    `deletion_timer_${user?._id}`,
    0
  );

  const sendLink = () => {
    dispatch(loadUser());
    if (!user.isVerified) {
      dispatch(sendEmailVerificationLink());
    } else {
      navigate("/profile");
    }
  };

  useEffect(()=>{
    if(googleUser === 'true'){
      toast.success('signed in with google')
      navigate('/profile')
    }
  },[googleUser])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  useEffect(() => {
    if (success && message) {
      if (!user.isVerified) {
        deletionCountdown.reset(accountDeletionCountdownExpiresAt);
        resendCountdown.reset(resendLinkIn);
        toast.success(message);
        dispatch(clearMessage());
      } else {
        toast.success(message);
        dispatch(clearMessage());
        const key = localStorage.getItem(`resend_timer_${user?._id}`);
        if (key) {
          localStorage.removeItem(`resend_timer_${user?._id}`);
          localStorage.removeItem(`deletion_timer_${user?._id}`);
        }
        navigate("/profile");
      }
    }
  }, [success, message, user]);

  useEffect(() => {
    if (
      !user.isVerified &&
      // means countdown is over ✅
      deletionCountdown.secondsLeft === 0 &&
      new Date(accountDeletionCountdownExpiresAt).getTime() <= Date.now() // makes sure timer was really active and has expired ✅
    ) {
      dispatch(signOutUser());
      toast.error("Account is deleted");
      dispatch(clearErrors());
      navigate("/signup");
    }
  }, [deletionCountdown.secondsLeft, user, accountDeletionCountdownExpiresAt]);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center gap-5 relative">
          {/* profie pic begins */}
          <div className="self-center relative">
            <picture className="w-55 h-55 block rounded-full overflow-hidden">
              <Skeleton height={"100%"} width={"100%"} circle />
            </picture>
            <span className="absolute text-xl top-0 right-0 active:text-[var(--purpleDark)] transition-colors">
              <Skeleton height={25} width={25} />
            </span>
          </div>
          {/* profie pic ends */}

          {/* name begins */}
          <div className="grid grid-cols-[5fr_1fr] items-center">
            <Skeleton height={45} />

            <span className="justify-self-end">
              <Skeleton height={25} width={25} />
            </span>
          </div>
          {/* name ends */}

          {/* email begins */}
          <div className="grid grid-cols-[5fr_1fr] items-center">
            <Skeleton height={45} />

            <span className="justify-self-end">
              <Skeleton height={25} width={25} />
            </span>
          </div>
          {/* email ends */}

          {/* address begins */}
          <h2 className="text-2xl">
            <Skeleton height={40} width={"60%"} />
          </h2>
          <Skeleton height={140} />

          <Skeleton height={40} />
          {/* address ends */}
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-5 relative">
          {/* profie pic begins */}
          <div className="self-center relative">
            <picture className="w-55 h-55 block rounded-full overflow-hidden">
              <ImageCard src={user.profilePic} />
            </picture>
            <FaEdit className="absolute text-xl top-0 right-0 active:text-[var(--purpleDark)] transition-colors" />
          </div>
          {/* profie pic ends */}

          {/* name begins */}
          <div className="grid grid-cols-[5fr_1fr] items-center">
            <input
              id="name"
              type="text"
              value={user.name}
              className="border rounded-md p-2 text-lg bg-white outline-none focus:border-[var(--purpleDark)] focus:ring-2 focus:ring-[var(--purpleDark)]"
              readOnly={true}
              autoComplete="off"
            />

            {!isEdit ? (
              <FaEdit className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
            ) : (
              <FaCheckSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
            )}
          </div>
          {/* name ends */}

          {/* email begins */}
          <div className="grid grid-cols-[5fr_1fr] items-center">
            <span className="relative w-full">
              <input
                id="email"
                type="email"
                value={user.email}
                className="border rounded-md p-2 text-lg bg-white outline-none w-full pr-8 focus:ring-2 focus:ring-[var(--purpleDark)]"
                readOnly={true}
                autoComplete="off"
              />
              {user.isVerified ? (
                <Tooltip
                  enterTouchDelay={1}
                  className="absolute top-1/2 right-2 -translate-y-1/2 z-100"
                  title="Verified"
                  placement="top-end"
                >
                  <FaCheck className="text-green-600 text-xl" />
                </Tooltip>
              ) : (
                <Tooltip
                  enterTouchDelay={1}
                  disableFocusListener
                  className="absolute top-1/2 right-2 -translate-y-1/2 z-100"
                  title="Not Verified"
                  placement="top-end"
                >
                  <FaExclamation className="text-red-600 text-xl" />
                </Tooltip>
              )}
            </span>

            {!isEdit ? (
              <FaEdit className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
            ) : (
              <FaCheckSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
            )}
          </div>
          {/* email ends */}

          {!user.isVerified && deletionCountdown.secondsLeft > 0 && (
            <p className="text-sm text-red-500 -mt-4">
              <span className="w-18 inline-block font-bold">
                {deletionCountdown.formatted}
              </span>{" "}
              left for account deletion if not verified
            </p>
          )}

          {!user.isVerified &&
            resendCountdown.secondsLeft === 0 &&
            !sending && (
              <span onClick={sendLink}>
                <FillButton type="button" name={"Send Verfication Link"} />
              </span>
            )}

          {!user.isVerified && (resendCountdown.secondsLeft > 0 || sending) && (
            <button className="flex justify-center items-center gap-2 w-full text-xl font-bold border-2 border-black rounded-md p-2 py-1 bg-black text-white">
              {sending
                ? "Sending..."
                : `Resend in ${resendCountdown.formatted}`}
            </button>
          )}

          {/* address begins */}
          <h2 className="text-2xl">Address</h2>

          {user.shippingAddress.length === 0 ? (
            <h3 className="text-xl">No address yet</h3>
          ) : (
            <div className="grid grid-cols-[5fr_1fr] items-center">
              <div className="flex flex-col justify-center gap-1 border bg-white rounded-md p-2">
                <h3 className="text-md">address</h3>
                <h3 className="text-md">city</h3>
                <h3 className="text-md">state, 136135</h3>
                <h3 className="text-md">mobile no</h3>
              </div>
              <span className="justify-self-end self-start flex flex-col items-center gap-5">
                {!isEdit ? (
                  <>
                    <FaEdit className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
                    <FaTrash className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
                  </>
                ) : (
                  <FaCheckSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
                )}
              </span>
            </div>
          )}

          <AddressModal />
          {/* address ends */}

          {isAdminUser && (
            <Link to="/admin/dashboard/home">
              <FillButton name={"Go To Dashboard"} />
            </Link>
          )}
        </div>
      )}
    </>
  );
};
