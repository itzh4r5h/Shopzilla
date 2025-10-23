import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckSquare } from "react-icons/fa";
import { updateName } from "../../store/thunks/non_admin/userThunk";
import { MdEditSquare } from "react-icons/md";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { userNameSchema } from "../../validators/userValidator";

export const ProfileName = () => {
  const schema = useMemo(() => {
    return userNameSchema
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

  useValidationErrorToast(errors)

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
