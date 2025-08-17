import { useForm } from "react-hook-form";
import { FillButton } from "../components/buttons/FillButton";
import { FaGoogle } from "react-icons/fa";
import { OutlineButton } from "../components/buttons/OutlineButton";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  sendEmailVerificationLink,
  signInUser,
  signUpUser,
} from "../store/thunks/userThunks";
import {clearUserError, clearUserMessage } from "../store/slices/userSlice";
import { useValidationErrorToast } from "../hooks/useValidationErrorToast";
import { useToastNotify } from "../hooks/useToastNotify";

export const SignInOrSignUp = ({ title }) => {
  const schema = useMemo(() => {
    const baseSchema = {};
    if (title.toLowerCase() === "sign up") {
      baseSchema.name = Joi.string().trim().min(3).max(20).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cann't exceed 20 characters",
      });
    }

    baseSchema.email = Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email",
      });

    baseSchema.password = Joi.string()
      .trim()
      .min(8)
      .max(20)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )
      )
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cann't exceed 20 characters",
        "string.pattern.base":
          "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
      });

    return Joi.object(baseSchema);
  }, [title]);

  const dispatch = useDispatch();
  const { error, isLoggedIn, success, message, user, loading } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const path = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const submitForm = (data) => {
    data.email = data.email.toLowerCase();
    switch (title.toLowerCase()) {
      case "sign up":
        dispatch(signUpUser(data));
        break;
      case "sign in":
        dispatch(signInUser(data));
        break;
    }
  };


    const signInSignupWithGoogle = () => {
    const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;
    window.location.href = googleAuthUrl;
  };


  useValidationErrorToast(errors)

  useToastNotify(error,success,message,clearUserError,clearUserMessage,dispatch)


  useEffect(() => {
    switch (title.toLowerCase()) {
      case "sign up":
        if (!loading && isLoggedIn && user) {
          toast.success("signed up");
          dispatch(sendEmailVerificationLink());
          navigate("/profile");
        }
        break;
      case "sign in":
        if (!loading && isLoggedIn && user) {
          localStorage.clear();
          toast.success("signed in");
          navigate("/");
        }
        break;
    }
  }, [title, isLoggedIn, loading, user]);



  // reset the form fields if url is changed
  useEffect(() => {
    reset();
  }, [path.pathname]);


  return (
    <div className="bg-white border border-black w-full p-3 flex flex-col justify-center gap-3">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col justify-center gap-5"
      >
        <h1 className="text-center text-2xl">{title}</h1>

        {/* name begins */}
        {title.toLowerCase() === "sign up" && (
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="name" className="text-xl w-fit">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              id="name"
              className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              autoComplete="off"
            />
          </div>
        )}
        {/* name ends */}

        {/* email begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="email" className="text-xl w-fit">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            id="email"
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none lowercase focus:ring-2 focus:ring-[var(--purpleDark)]"
            autoComplete="off"
          />
        </div>
        {/* email ends */}

        {/* password begins */}
        <div className="flex flex-col justify-center gap-2 mb-4">
          <label htmlFor="password" className="text-xl w-fit">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            id="password"
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
            autoComplete="off"
          />
        </div>
        {/* password ends */}

        <OutlineButton name={title} type={"submit"} />
      </form>
      <span onClick={signInSignupWithGoogle}>
        <FillButton
          name={"Sign In With Google"}
          icon={<FaGoogle />}
          type="button"
        />
      </span>
    </div>
  );
};
