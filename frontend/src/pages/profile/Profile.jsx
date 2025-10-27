import { FillButton } from "../../components/buttons/FillButton";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  sendEmailVerificationLink,
  verifyEmail,
} from "../../store/thunks/non_admin/emailThunk";
import { signOutUser } from "../../store/thunks/non_admin/authThunk";
import { loadUser } from "../../store/thunks/non_admin/userThunk";
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

  const { user, loading: userLoading } = useSelector((state) => state.user);

  const { sending, resendLinkIn } = useSelector((state) => state.email);

  const { loading: authLoading, accountDeletionCountdownExpiresAt } =
    useSelector((state) => state.auth);

  const isAdminUser = user?.role === "admin";

  const resendCountdown = useSyncedCountdown(`resend_timer_${user?._id}`);
  const deletionCountdown = useSyncedCountdown(`deletion_timer_${user?._id}`);

  const sendLink = () => {
    dispatch(loadUser());
    if (!user?.isVerified) {
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
    if (accountDeletionCountdownExpiresAt) {
      deletionCountdown.reset(accountDeletionCountdownExpiresAt);
    }
  }, [accountDeletionCountdownExpiresAt]);

  useEffect(() => {
    if (resendLinkIn) {
      resendCountdown.reset(resendLinkIn);
    }
  }, [resendLinkIn]);

  useEffect(() => {
    // defensive: make sure deletionCountdown exists and secondsLeft is a number
    const seconds =
      deletionCountdown && typeof deletionCountdown.secondsLeft !== "undefined"
        ? Number(deletionCountdown.secondsLeft)
        : null;

    // if countdown still running or invalid, do nothing
    if (seconds === null || seconds > 0) return;

    // need a user to proceed
    if (!user || !user._id) {
      return;
    }

    const key = `deletion_timer_${user._id}`;
    const timeStr = localStorage.getItem(key);

    if (!timeStr) {
      return;
    }

    const timeMs = new Date(timeStr).getTime();
    if (Number.isNaN(timeMs)) {
      return;
    }

    if (timeMs > Date.now()) {
      return;
    }

    // Everything checks out — perform sign out, navigate, cleanup.
    dispatch(signOutUser());

    // clearing entire localStorage.
    localStorage.clear();

    // show toast and navigate
    toast.error("Account is deleted");
    navigate("/signup");

    // include deps to avoid stale closures
  }, [deletionCountdown, user, dispatch, navigate, toast]);

  const hasDispatched = useRef(false);

  useEffect(() => {
    if (!user) return; // no user, no token checking

    if (!token) return; // no token, do nothing

    // If user is verified, redirect immediately
    if (user.isVerified) {
      navigate("/profile");
      return;
    }

    // If not verified, dispatch verification once
    if (!hasDispatched.current) {
      dispatch(verifyEmail(token));
      hasDispatched.current = true;
    }
  }, [token, user]);

  useEffect(() => {
    if (!user) return; // early exit if user not ready

    const resendKey = `resend_timer_${user._id}`;
    const deletionKey = `deletion_timer_${user._id}`;

    const hasResendTimer = localStorage.getItem(resendKey);
    const hasDeletionTimer = localStorage.getItem(deletionKey);

    // If there are no timers, do nothing
    if (!hasResendTimer && !hasDeletionTimer) return;

    // If user is verified, clean up both timers
    if (user.isVerified) {
      localStorage.removeItem(resendKey);
      localStorage.removeItem(deletionKey);
    }
  }, [user]);

  const isLoading = userLoading || authLoading;

  return (
    <>
      {!isLoading && user ? (
        <div className="flex flex-col justify-center gap-5 relative">
          {/* profie pic begins */}
          <ProfileImage profilePic={user.profilePic} />
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

          {user?.isVerified && <ProfilePassword />}

          {/* address begins */}
          {user?.isVerified && <ProfileAddress />}
          {/* address ends */}

          {isAdminUser && (
            <Link to="/admin/dashboard/home">
              <FillButton name={"Go To Dashboard"} />
            </Link>
          )}
        </div>
      ) : (
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
      )}
    </>
  );
};
