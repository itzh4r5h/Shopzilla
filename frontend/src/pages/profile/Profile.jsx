import { FillButton } from "../../components/buttons/FillButton";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { clearErrors, clearMessage } from "../../store/slices/userSlice";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  loadUser,
  sendEmailVerificationLink,
  signOutUser,
  verifyEmail,
} from "../../store/thunks/userThunks";
import { useSyncedCountdown } from "../../hooks/useSyncedCountdown";
import { ProfileName } from "./ProfileName";
import { ProfileEmail } from "./ProfileEmail";
import { ProfilePassword } from "./ProfilePassword";
import { ProfileAddress } from "./ProfileAddress";
import { ProfileImage } from "./ProfileImage";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const path = useLocation();
  const searchParams = new URLSearchParams(path.search);

  const googleUser = searchParams.get("google_user");

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

  useEffect(() => {
    if (googleUser === "true") {
      toast.success("signed in with google");
      navigate("/profile");
    }
  }, [googleUser]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);

  useEffect(() => {
    if (!user.isVerified) {
      deletionCountdown.reset(accountDeletionCountdownExpiresAt);
      resendCountdown.reset(resendLinkIn);
    }
  }, [resendLinkIn, accountDeletionCountdownExpiresAt, user]);

  useEffect(() => {
    if (
      !user.isVerified &&
      // means countdown is over ✅
      deletionCountdown.secondsLeft === 0 &&
      new Date(accountDeletionCountdownExpiresAt).getTime() <= Date.now() // makes sure timer was really active and has expired ✅
    ) {
      dispatch(signOutUser());
      localStorage.clear()
      toast.error("Account is deleted");
      dispatch(clearErrors());
      navigate("/signup");
    }
  }, [deletionCountdown.secondsLeft, accountDeletionCountdownExpiresAt, user]);

  const hasDispatched = useRef(false);
  useEffect(() => {
    if (token && !hasDispatched.current) {
      dispatch(verifyEmail(token));
      hasDispatched.current = true;
    }
  }, [token]);

  useEffect(() => {
    const key1 = localStorage.getItem(`resend_timer_${user?._id}`)
    const key2 = localStorage.getItem(`deletion_timer_${user?._id}`)
    if (user.isVerified) {
      if(key1 || key2){
        localStorage.removeItem(`resend_timer_${user?._id}`)
        localStorage.removeItem(`deletion_timer_${user?._id}`)
      }
      navigate("/profile");
    }
  }, [user]);

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
          <ProfileImage profilePic={user.profilePic}/>
          {/* profie pic ends */}

          {/* name begins */}
          <ProfileName />
          {/* name ends */}

          {/* email begins */}
          <ProfileEmail />

          {!user.isVerified && deletionCountdown.secondsLeft > 0 && (
            <p className="text-sm text-red-500 -mt-4">
              <span className="w-18 inline-block font-bold">
                {deletionCountdown.formatted}
              </span>
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
            <button
              type="button"
              className="flex justify-center items-center gap-2 w-full text-xl font-bold border-2 border-black rounded-md p-2 py-1 bg-black text-white"
            >
              {sending
                ? "Sending..."
                : `Resend in ${resendCountdown.formatted}`}
            </button>
          )}
          {/* email ends */}


          <ProfilePassword/>

          {/* address begins */}
          <ProfileAddress/>
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
