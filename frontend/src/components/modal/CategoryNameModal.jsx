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
import { CustomDialog } from "../common/CustomDialog";

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
    defaultValues: {
      name,
      icon,
    },
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
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={"Update Category Name"}
      >
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col justify-center gap-5"
        >
          <div className="grid grid-cols-2 gap-x-2">
            {/* name begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="name" className="text-xl w-fit">
                Name
              </label>
              <input
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

              <IconSelector name={"icon"} control={control} />
            </div>
            {/* icon ends */}
          </div>

          <FillButton type="submit" name="Update" />
        </form>
      </CustomDialog>
    </div>
  );
};
