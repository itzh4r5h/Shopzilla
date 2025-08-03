import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../../components/buttons/OutlineButton";
import { FillButton } from "../../components/buttons/FillButton";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showError } from "../../utils/showError";
import { updatePassword } from "../../store/thunks/userThunks";

export const ProfilePassword = () => {
  const schema = useMemo(() => {
    return Joi.object({
      oldPassword: Joi.string()
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
          "string.empty": "Old Password is required",
          "string.min": "Old Password must be at least 8 characters",
          "string.max": "Old Password cann't exceed 20 characters",
          "string.pattern.base":
            "Old Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
        }),

      newPassword: Joi.string()
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
          "string.empty": "New Password is required",
          "string.min": "New Password must be at least 8 characters",
          "string.max": "New Password cann't exceed 20 characters",
          "string.pattern.base":
            "Old Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, $, )",
        }),
    });
  }, []);

  const dispatch = useDispatch();
    const { updated } = useSelector(
    (state) => state.user
  );

  const submitForm = (data) => {
    dispatch(updatePassword(data));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  useEffect(() => {
    if (updated) {
      setOpen(false)
    }
  }, [updated]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton name={"Update Password"} />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-100 bg-[#00000063]"></div>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="bg-white border border-black w-full absolute z-200 top-0 p-3 flex flex-col justify-center gap-5"
          >
            <FaTimesCircle
              className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
              onClick={handleClose}
            />

            <h1 className="text-center text-3xl -mt-5">Update Password</h1>

            {/* old password begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="oldPassword" className="text-xl w-fit">
                Old Password
              </label>
              <input
                type="password"
                {...register("oldPassword", { required: true })}
                id="oldPassword"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* old password ends */}

            {/* new password begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="newPassword" className="text-xl w-fit">
                New Password
              </label>
              <input
                type="password"
                {...register("newPassword", { required: true })}
                id="newPassword"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* new password ends */}

            <span>
              <FillButton type="submit" name={"Update"} />
            </span>
          </form>
        </>
      )}
    </div>
  );
};
