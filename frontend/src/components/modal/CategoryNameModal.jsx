import { FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { nameJoiSchema } from "../../validators/categoryValidator";
import { IconSelector } from "../selectors/IconSelector";
import { deepLowercase } from "../../utils/helpers";
import {
  updateCategoryName,
  updateSubCategoryName,
} from "../../store/thunks/admin/categoryThunk";
import { MdEditSquare } from "react-icons/md";

export const CategoryNameModal = ({ name, icon, id, subId = false }) => {
  const schema = useMemo(() => {
    return nameJoiSchema;
  }, []);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    const categoryData = deepLowercase(data);
    categoryData.id = id;
    if (subId) {
      categoryData.subId = subId;
      dispatch(updateSubCategoryName(categoryData));
    } else {
      dispatch(updateCategoryName(categoryData));
    }
    handleClose();
  };

  useValidationErrorToast(errors);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <MdEditSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-999 bg-[#00000089] p-2 py-4 overflow-y-auto grid place-items-center">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="bg-white w-full border border-black p-3 flex flex-col justify-center gap-5"
            >
              <FaTimesCircle
                className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
                onClick={handleClose}
              />

              <h1 className="text-center text-3xl -mt-5">
                Update Category Name
              </h1>

              <div className="grid grid-cols-2 gap-x-2">
                {/* name begins */}
                <div className="flex flex-col justify-center gap-2">
                  <label htmlFor="name" className="text-xl w-fit">
                    Name
                  </label>
                  <input
                    defaultValue={name}
                    autoComplete="off"
                    {...register("name", { required: true })}
                    id="name"
                    className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                  />
                </div>
                {/* name ends */}
                {/* icon begins */}
                <div className="flex flex-col justify-center gap-2">
                  <label htmlFor="icon" className="text-xl w-fit">
                    Icon
                  </label>

                  <IconSelector
                    name={"icon"}
                    control={control}
                    selected={icon}
                  />
                </div>
                {/* icon ends */}
              </div>

              <FillButton type="submit" name="Update" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
