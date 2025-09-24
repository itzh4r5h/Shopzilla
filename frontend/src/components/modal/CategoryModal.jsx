import { FaMinusCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import {
  categoryJoiSchema
} from "../../validators/categoryValidator";
import { IconSelector } from "../selectors/IconSelector";
import { deepLowercase } from "../../utils/helpers";
import { addCategory } from "../../store/thunks/categoryThunk";
import { SubCategory } from "../common/SubCategory";


export const CategoryModal = () => {
  const schema = useMemo(() => {
    return categoryJoiSchema;
  }, []);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category_icon: "",
      subcategories: [
        {
          name: "",
          subcategory_icon:'',
          attributes: [{ name: "", type: "string" }],
        },
      ],
    },
    resolver: joiResolver(schema),
  });

  // For subcategories
  const {
    fields: subcategories,
    append: addSubcat,
    remove: removeSubcat,
  } = useFieldArray({
    control,
    name: "subcategories",
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    const categoryData = deepLowercase(data)
    dispatch(addCategory(categoryData))
    handleClose();
  };

  useValidationErrorToast(errors);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"Add Category"} />
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

              <h1 className="text-center text-3xl -mt-5">Category</h1>

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
                  <label htmlFor="category_icon" className="text-xl w-fit">
                    Icon
                  </label>

                  <IconSelector
                    name={"category_icon"}
                    control={control}
                  />
                </div>
                {/* icon ends */}
              </div>

              <h2 className="text-2xl">Sub Categories</h2>

              {subcategories.map((subcat, index) => {
                return (
                  <div key={subcat.id}>
                    <SubCategory
                      subkey={subcat.id}
                      subCategoriesLength={subcategories.length}
                      addSubCategory={() =>
                        addSubcat({
                          name: "",
                          subcategory_icon: "",
                          attributes: [{ name: "", type: "string" }],
                        })
                      }
                      removeSubCategory={() => removeSubcat(index)}
                      subCategoryName={`subcategories.${index}.name`}
                      subcatIndex={index}
                      control={control}
                      register={register}
                    />
                  </div>
                );
              })}

              <FillButton type="submit" name="Add" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
