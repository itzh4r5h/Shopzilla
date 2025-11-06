import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { subcategoriesJoiSchema } from "../../validators/categoryValidator";
import { deepLowercase } from "../../utils/helpers";
import { addSubCategories } from "../../store/thunks/admin/categoryThunk";
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

export const SubCategoryModal = ({ id }) => {
  const schema = useMemo(() => {
    return subcategoriesJoiSchema;
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
    categoryData.id = id;
    dispatch(addSubCategories(categoryData));
    handleClose();
  };

  const swiperRef = useRef(null);
  const childSwiperRefs = useRef([]);

  useValidationErrorToast(errors, { main: swiperRef, childs: childSwiperRefs });

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"Add Sub Category"} />
      </span>

      <CustomDialog open={open} handleClose={handleClose} title={'Subcategories'}>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col justify-center gap-5"
        >
        
          <CustomSwiperSlider
            swiperRef={swiperRef}
            space={20}
            slideData={subcategories}
            className="subcategories_swiper"
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

          <span className="-mt-4">
            <FillButton type="submit" name="Add" />
          </span>
        </form>
      </CustomDialog>
    </div>
  );
};
