import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { showError } from "../../utils/showError";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckSquare } from "react-icons/fa";
import { updateName } from "../../store/thunks/userThunks";
import { MdEditSquare } from "react-icons/md";

export const ProfileName = () => {
  const schema = useMemo(() => {
    return Joi.object({
      name: Joi.string().trim().min(3).max(20).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cann't exceed 20 characters",
      })
    });
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [readOnly, setReadOnly] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const submitForm = (data) => {
    if (data.name === user.name) {
      setReadOnly(true);
      reset();
    } else {
      dispatch(updateName(data.name));
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
      <input
        id="name"
        type="text"
        {...register("name", { required: true })}
        defaultValue={user.name}
        className={`border rounded-md p-2 text-lg bg-white outline-none ${
          !readOnly &&
          "focus:border-[var(--purpleDark)] focus:ring-2 focus:ring-[var(--purpleDark)]"
        }`}
        readOnly={readOnly}
        autoComplete="off"
        onBlur={resetInputStateOnBlur}
      />

      {readOnly ? (
        <label
          htmlFor="name"
          onClick={() =>user.isVerified && setReadOnly(false)}
          className="justify-self-end"
        >
          <MdEditSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
        </label>
      ) : (
        <label htmlFor="name" className="justify-self-end">
          <button type="submit">
            <FaCheckSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </button>
        </label>
      )}
    </form>
  );
};
