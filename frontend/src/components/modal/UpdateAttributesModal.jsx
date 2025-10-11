import { FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { attributesJoiSchema } from "../../validators/categoryValidator";
import { cleanAttributes, deepLowercase } from "../../utils/helpers";
import { updateAttributes } from "../../store/thunks/categoryThunk";
import { AttributeComponent } from "../common/AttributeComponent";



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
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attributes: cleanAttributes(attributesData),
    },
    resolver: joiResolver(schema),
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

  useValidationErrorToast(errors);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <FillButton name={"update attributes"} />
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

              <h1 className="text-center text-3xl -mt-5">Attributes</h1>

              {attributes.map((attribute, index) => {
                return (
                  <div key={attribute.id}>
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
                  </div>
                );
              })}

              <FillButton type="submit" name="Update" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
