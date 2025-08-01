import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi, { ref } from "joi";
import { showError } from "../../utils/showError";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaCheckSquare, FaEdit, FaExclamation } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

export const ProfileEmail = () => {
  const schema = useMemo(() => {
    return Joi.object({
      email: Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email",
      })
    });
  }, []);

  const dispatch = useDispatch();
  const { user,resendOtpIn,sending } = useSelector((state) => state.user);
  const [readOnly, setReadOnly] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const submitForm = (data) => {
    data.email = data.email.toLowerCase()

    if (data.email === user.email) {
      setReadOnly(true);
      reset();
    } else {
      // dispatch(updateName(data.name));
      console.log(data);
      setReadOnly(true);
    }
  };

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  const resetInputStateOnBlur = () => {
    if (!readOnly) {
      setTimeout(() => {
        setReadOnly(true);
        reset();
      }, 50);
    }
  };

  return (
    <form
      className="grid grid-cols-[5fr_1fr] items-center"
      onSubmit={handleSubmit(submitForm)}
    >
      <span className="relative w-full">
        <input
          id="email"
          type="email"
          {...register("email", { required: true })}
          defaultValue={user.email}
          className={`w-full border rounded-md p-2 text-lg bg-white outline-none ${
          !readOnly &&
          "focus:border-[var(--purpleDark)] focus:ring-2 focus:ring-[var(--purpleDark)]"
        }`}
          readOnly={readOnly}
          autoComplete="off"
          onBlur={resetInputStateOnBlur}
        />
        {readOnly && (user.isVerified ? (
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
          onClick={() =>user.isVerified && setReadOnly(false)}
          className="justify-self-end"
        >
          <FaEdit className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
        </label>
      ) : (
        <label htmlFor="email" className="justify-self-end">
          <button type="submit">
            <FaCheckSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </button>
        </label>
      )}
    </form>
  );
};
