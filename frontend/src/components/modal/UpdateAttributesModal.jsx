import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useRef, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { attributesJoiSchema } from "../../validators/categoryValidator";
import { cleanAttributes, deepLowercase } from "../../utils/helpers";
import { updateAttributes } from "../../store/thunks/admin/categoryThunk";
import { AttributeComponent } from "../common/AttributeComponent";
import { CustomSwiperSlider } from "../common/CustomSwiperSlider";
import { CustomDialog } from "../common/CustomDialog";

const SlideComponent = ({
  attributes,
  index,
  register,
  control,
  addAttr,
  removeAttr,
}) => {
  return (
    <AttributeComponent
      attributesLength={attributes.length}
      attributeName={`attributes.${index}.name`}
      attributeType={`attributes.${index}.type`}
      addAttribute={() => addAttr({ name: "" })}
      removeAttribute={() => removeAttr(index)}
      register={register}
      control={control}
      attrIndex={index}
    />
  );
};

export const UpdateAttributesModal = ({ attributesData, id, subId }) => {
  const schema = useMemo(() => {
    return attributesJoiSchema;
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
      attributes: cleanAttributes(attributesData),
    },
    resolver: joiResolver(schema),
    shouldFocusError: false,
  });

  // For attributes inside each subcategory
  const {
    fields: attributes,
    append: addAttr,
    remove: removeAttr,
  } = useFieldArray({
    control,
    name: "attributes",
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    const attributesData = deepLowercase(data);
    attributesData.id = id;
    attributesData.subId = subId;
    dispatch(updateAttributes(attributesData));
    handleClose();
  };

  const swiperRef = useRef(null);

  useValidationErrorToast(errors, { main: swiperRef });

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"update attributes"} />
      </span>

      <CustomDialog open={open} handleClose={handleClose} title={"Attributes"}>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col justify-center gap-5"
        >
          <CustomSwiperSlider
            swiperRef={swiperRef}
            space={20}
            slideData={attributes}
            className="update_attributes_swiper"
          >
            <SlideComponent
              attributes={attributes}
              register={register}
              control={control}
              removeAttr={removeAttr}
              addAttr={addAttr}
            />
          </CustomSwiperSlider>

          <span className="-mt-4">
            <FillButton type="submit" name="Update" />
          </span>
        </form>
      </CustomDialog>
    </div>
  );
};
