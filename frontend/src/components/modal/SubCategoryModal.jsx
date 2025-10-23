import { FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import {
    subcategoriesJoiSchema,
} from "../../validators/categoryValidator";
import { deepLowercase } from "../../utils/helpers";
import { addSubCategories } from "../../store/thunks/admin/categoryThunk";
import { SubCategory } from "../common/SubCategory";


export const SubCategoryModal = ({id}) => {
  const schema = useMemo(() => {
    return subcategoriesJoiSchema;
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
      subcategories: [
        {
          name: "",
          subcategory_icon:'',
          needSize: 'false',
          attributes: [{ name: ""}],
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
    categoryData.id = id
    dispatch(addSubCategories(categoryData))
    handleClose();
  };

  useValidationErrorToast(errors);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"Add Sub Category"} />
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

              <h1 className="text-center text-3xl -mt-5">Sub Categories</h1>

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
                          needSize: "false",
                          attributes: [{ name: ""}],
                        })
                      }
                      removeSubCategory={() => removeSubcat(index)}
                      subCategoryName={`subcategories.${index}.name`}
                      subcatIndex={index}
                      control={control}
                      register={register}
                      setValue={setValue}
                      watch={watch}
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
