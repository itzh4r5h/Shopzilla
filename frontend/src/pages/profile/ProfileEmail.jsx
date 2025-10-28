import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaExclamation } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { useSyncedCountdown } from "../../hooks/useSyncedCountdown";
import { FillButton } from "../../components/buttons/FillButton";
import { FaTimesCircle } from "react-icons/fa";
import { sendOtpToEmail } from "../../store/thunks/non_admin/emailThunk";
import {
  cancelUpdateEmail,
  updateEmail,
} from "../../store/thunks/non_admin/userThunk";
import { MdEditSquare } from "react-icons/md";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { emailJoiSchema } from "../../validators/userValidator";

export const ProfileEmail = () => {
  const { user, updated } = useSelector((state) => state.user);
  const { resendOtpIn, sending } = useSelector((state) => state.email);

  const isOtpResendExists = localStorage.getItem(
    `otp_resend_timer_${user?._id}`
  );

  const schema = useMemo(() => {
    return emailJoiSchema(isOtpResendExists);
  }, [isOtpResendExists]);

  const dispatch = useDispatch();
  const [readOnly, setReadOnly] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const submitForm = (data) => {
    data.email = data.email.toLowerCase();
    data.otp = data.otp.toLowerCase();
    dispatch(updateEmail(data));
  };

  const sendOtp = () => {
    const email = getValues("email");
    if (email === user.email) {
      setReadOnly(true);
      return toast.error("enter new email");
    } else {
      dispatch(sendOtpToEmail(email));
    }
  };

  const resendCountdown = useSyncedCountdown(`otp_resend_timer_${user?._id}`);

  useEffect(() => {
    if (resendOtpIn) {
      localStorage.setItem("email", getValues("email"));
      resendCountdown.reset(resendOtpIn);
    }
  }, [resendOtpIn]);

  useEffect(() => {
    if (isOtpResendExists) {
      setReadOnly(false);
    }
  }, [isOtpResendExists]);

  useEffect(() => {
    if (updated) {
      localStorage.removeItem(`otp_resend_timer_${user?._id}`);
      localStorage.removeItem("email");
      setReadOnly(true);
      resendCountdown.setSecondsLeft(0);
    }
  }, [updated]);

  useValidationErrorToast(errors);

  const cancelUpdation = () => {
    const key1 = localStorage.getItem("email");
    const key2 = localStorage.getItem(`otp_resend_timer_${user?._id}`);
    if (key1 && key2) {
      localStorage.removeItem("email");
      localStorage.removeItem(`otp_resend_timer_${user?._id}`);
      setReadOnly(true);
      reset();
      dispatch(cancelUpdateEmail());
      resendCountdown.setSecondsLeft(0);
    } else {
      reset();
      setReadOnly(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col justify-center items-center gap-2"
    >
      <div className="grid grid-cols-[5fr_1fr] items-center w-full">
        <span className="relative w-full">
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            defaultValue={localStorage.getItem("email") || user.email}
            className={`w-full border rounded-md p-2 text-lg bg-white outline-none ${
              !readOnly &&
              "focus:border-[var(--purpleDark)] focus:ring-2 focus:ring-[var(--purpleDark)]"
            }`}
            readOnly={readOnly}
            autoComplete="off"
          />
          {readOnly &&
            (user.isVerified ? (
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
            ))}
        </span>

        {readOnly ? (
          <label
            htmlFor="email"
            onClick={() => user.isVerified && setReadOnly(false)}
            className="justify-self-end"
          >
            <MdEditSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </label>
        ) : (
          <FaTimesCircle
            onClick={cancelUpdation}
            className="text-2xl active:text-[var(--purpleDark)] justify-self-end transition-colors"
          />
        )}
      </div>

      {!readOnly && (
        <div
          className={`grid ${
            isOtpResendExists ? "grid-cols-[3fr_2.5fr]" : "grid-cols-1"
          } items-center w-full gap-x-3`}
        >
          {isOtpResendExists && (
            <span className="relative w-full">
              <input
                id="otp"
                type="text"
                {...register("otp", { required: true })}
                className="w-full border rounded-md p-2 text-lg bg-white outline-none focus:border-[var(--purpleDark)] focus:ring-2 focus:ring-[var(--purpleDark)]"
                autoComplete="off"
                placeholder="enter otp"
              />
            </span>
          )}
          {!readOnly && resendCountdown.secondsLeft === 0 && !sending && (
            <span className="w-full" onClick={sendOtp}>
              <FillButton
                type="button"
                name={isOtpResendExists ? "Resend OTP" : "Send OTP"}
              />
            </span>
          )}

          {!readOnly && (resendCountdown.secondsLeft > 0 || sending) && (
            <p className="text-lg text-center font-bold">
              {sending ? "Sending..." : `${resendCountdown.formatted}`}
            </p>
          )}
        </div>
      )}

      {!readOnly && isOtpResendExists && (
        <span className="w-full">
          <FillButton type="submit" name={"Submit"} />
        </span>
      )}
    </form>
  );
};
