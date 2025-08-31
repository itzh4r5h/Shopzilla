import { useForm } from "react-hook-form";
import { FillButton } from "../components/buttons/FillButton";
import { useLocation, useParams } from "react-router";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  loadUser,
  resetPassword,
  sendPasswordResetTokenToEmail,
} from "../store/thunks/userThunks";
import { clearUserError, clearUserMessage } from "../store/slices/userSlice";
import { useSyncedCountdown } from "../hooks/useSyncedCountdown";
import { useToastNotify } from "../hooks/useToastNotify";
import { useValidationErrorToast } from "../hooks/useValidationErrorToast";
import { resetPasswordJoiSchema } from "../validators/userValidator";

export const ResetPassword = () => {
  const { token } = useParams();
  const schema = useMemo(() => {
    return resetPasswordJoiSchema(token)
  }, [token]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation()
  const {
    error,
    isLoggedIn,
    success,
    message,
    resendTokenIn,
    sending,
  } = useSelector((state) => state.user);

  const resendTokenCountdown = useSyncedCountdown(`resend_token_timer`, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const submitForm = (data) => {
    dispatch(loadUser());
    if (isLoggedIn) {
      navigate("/");
    } else {
      if (!token) {
        data.email = data.email.toLowerCase();
        dispatch(sendPasswordResetTokenToEmail(data.email));
        localStorage.setItem("email", data.email);
      } else {
        dispatch(resetPassword({ resetToken: token, password: data.password }));
        reset();
      }
    }
  };

  useValidationErrorToast(errors)

  useToastNotify(error,success,message,clearUserError,clearUserMessage,dispatch)

  useEffect(()=>{
    if(resendTokenIn){
      resendTokenCountdown.reset(resendTokenIn)
    }
  },[resendTokenIn])

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.removeItem("resend_token_timer");
      localStorage.removeItem("email");
      toast.success("password changed");
      navigate("/");
    }
  }, [isLoggedIn]);


  useEffect(()=>{
    if(resendTokenCountdown.secondsLeft < 1){
      localStorage.removeItem("resend_token_timer");
      localStorage.removeItem("email");
      reset()
    }
  },[path.pathname])

  return (
    <div>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="bg-white border border-black w-full p-3 flex flex-col justify-center gap-5"
      >
        <h1 className="text-center text-2xl">Reset Password</h1>

        {/* email begins */}
        {!token && (
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="email" className="text-xl w-fit">
              Email
            </label>
            <input
              autoComplete="off"
              type="email"
              {...register("email", { required: true })}
              defaultValue={localStorage.getItem("email")}
              id="email"
              className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)] lowercase"
            />
          </div>
        )}
        {/* email ends */}

        {/* password begins */}
        {token && (
          <div className="flex flex-col justify-center gap-2 mb-4">
            <label htmlFor="password" className="text-xl w-fit">
              New Password
            </label>
            <input
              autoComplete="off"
              type="password"
              {...register("password", { required: true })}
              id="password"
              className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
            />
          </div>
        )}
        {/* password ends */}

        {((resendTokenCountdown.secondsLeft < 1 && !sending) || token) && (
          <FillButton
            name={!token ? "Send Reset Password URL" : "Submit"}
            type="submit"
          />
        )}

        {(resendTokenCountdown.secondsLeft > 0 || sending) && !token && (
          <button
            type="button"
            className="flex justify-center items-center gap-2 w-full text-xl font-bold border-2 border-black rounded-md p-2 py-1 bg-black text-white"
          >
            {sending
              ? "Sending..."
              : `Resend in ${resendTokenCountdown.formatted}`}
          </button>
        )}
      </form>
    </div>
  );
};
