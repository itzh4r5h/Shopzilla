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
import { createPassword, updatePassword } from "../../store/thunks/userThunks";

export const ProfilePassword = () => {
  const { updated, isPasswordExists } = useSelector((state) => state.user);
  const schema = useMemo(() => {
    const baseSchema = {};

    if (isPasswordExists) {
      baseSchema.oldPassword = Joi.string()
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
        });
    }

    baseSchema.newPassword = Joi.string()
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
      });

    return Joi.object(baseSchema);
  }, [isPasswordExists]);

  const dispatch = useDispatch();

  const submitForm = (data) => {
   if(isPasswordExists){
     dispatch(updatePassword(data));
   }else{
    dispatch(createPassword(data))
   }
   reset()
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
      setOpen(false);
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
        <OutlineButton name={isPasswordExists ?"Update Password":'Create Password'} />
      </span>
      {open && (
        <div className="w-full h-screen fixed top-0 left-0 z-999 p-2 bg-[#00000089] overflow-y-auto">
          <form
            onSubmit={handleSubmit(submitForm)}
            className="bg-white border border-black w-full p-3 flex flex-col justify-center gap-5 translate-y-1/2"
          >
            <FaTimesCircle
              className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
              onClick={handleClose}
            />

            <h1 className="text-center text-3xl -mt-5">{isPasswordExists?'Update Password':'Create Password'}</h1>

            {/* old password begins */}
           {isPasswordExists && <div className="flex flex-col justify-center gap-2">
              <label htmlFor="oldPassword" className="text-xl w-fit">
                Old Password
              </label>
              <input
              autoComplete="off"
                type="password"
                {...register("oldPassword", { required: true })}
                id="oldPassword"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>}
            {/* old password ends */}

            {/* new password begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="newPassword" className="text-xl w-fit">
                New Password
              </label>
              <input
              autoComplete="off"
                type="password"
                {...register("newPassword", { required: true })}
                id="newPassword"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* new password ends */}

            <span>
              <FillButton type="submit" name={isPasswordExists?"Update":"Create"} />
            </span>
          </form>
        </div>
      )}
    </div>
  );
};
