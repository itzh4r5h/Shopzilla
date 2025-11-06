import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../../components/buttons/OutlineButton";
import { FillButton } from "../../components/buttons/FillButton";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPassword,
  updatePassword,
} from "../../store/thunks/non_admin/userThunk";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { userPasswordSchema } from "../../validators/userValidator";
import { CustomDialog } from "../../components/common/CustomDialog";

export const ProfilePassword = () => {
  const { updated, isPasswordExists } = useSelector((state) => state.user);
  const schema = useMemo(() => {
    return userPasswordSchema(isPasswordExists);
  }, [isPasswordExists]);

  const dispatch = useDispatch();

  const submitForm = (data) => {
    if (isPasswordExists) {
      dispatch(updatePassword(data));
    } else {
      dispatch(createPassword(data));
    }
    handleClose()
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  useValidationErrorToast(errors);

  useEffect(() => {
    if (updated) {
      setOpen(false);
    }
  }, [updated]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton
          name={isPasswordExists ? "Update Password" : "Create Password"}
        />
      </span>

      <CustomDialog open={open} handleClose={handleClose} title={isPasswordExists ? "Update Password" : "Create Password"}>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col justify-center gap-5"
        >

          {/* old password begins */}
          {isPasswordExists && (
            <div className="flex flex-col justify-center gap-2">
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
            </div>
          )}
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
            <FillButton
              type="submit"
              name={isPasswordExists ? "Update" : "Create"}
            />
          </span>
        </form>
      </CustomDialog>
    </div>
  );
};
