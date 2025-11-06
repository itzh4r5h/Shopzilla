import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { categoryJoiSchema } from "../../validators/categoryValidator";
import { IconSelector } from "../selectors/IconSelector";
import { deepLowercase } from "../../utils/helpers";
import { addCategory } from "../../store/thunks/admin/categoryThunk";
import { SubCategory } from "../common/SubCategory";
import { CustomSwiperSlider } from "../common/CustomSwiperSlider";
import { CustomDialog } from "../common/CustomDialog";

const SlideComponent = ({
  subcategories,
  index,
  register,
  control,
  addSubcat,
  removeSubcat,
  childSwiperRefs,
}) => {
  return (
    <SubCategory
      subCategoriesLength={subcategories.length}
      addSubCategory={() =>
        addSubcat({
          name: "",
          subcategory_icon: "",
          needSize: "false",
          attributes: [{ name: "" }],
        })
      }
      removeSubCategory={() => removeSubcat(index)}
      subCategoryName={`subcategories.${index}.name`}
      subcatIndex={index}
      control={control}
      register={register}
      childSwiperRefs={childSwiperRefs}
    />
  );
};

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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category_icon: "",
      subcategories: [
        {
          name: "",
          subcategory_icon: "",
          needSize: "false",
          attributes: [{ name: "" }],
        },
      ],
    },
    resolver: joiResolver(schema),
    shouldFocusError: false,
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
    const categoryData = deepLowercase(data);
    dispatch(addCategory(categoryData));
    handleClose();
  };

  const swiperRef = useRef(null);
  const childSwiperRefs = useRef([]);

  useValidationErrorToast(errors, { main: swiperRef, childs: childSwiperRefs });

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"Add Category"} />
      </span>

      <CustomDialog open={open} handleClose={handleClose} title={'Category'} >
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
              <label htmlFor="category_icon" className="text-xl w-fit">
                Icon
              </label>

              <IconSelector name={"category_icon"} control={control} />
            </div>
            {/* icon ends */}
          </div>

          <h2 className="text-2xl">Sub Categories</h2>

          <CustomSwiperSlider
            swiperRef={swiperRef}
            space={20}
            slideData={subcategories}
            className="category_subcategories_swiper"
          >
            <SlideComponent
              subcategories={subcategories}
              register={register}
              control={control}
              removeSubcat={removeSubcat}
              addSubcat={addSubcat}
              childSwiperRefs={childSwiperRefs}
            />
          </CustomSwiperSlider>

          <span className="-mt-5">
            <FillButton type="submit" name="Add" />
          </span>
        </form>
      </CustomDialog>
    </div>
  );
};
