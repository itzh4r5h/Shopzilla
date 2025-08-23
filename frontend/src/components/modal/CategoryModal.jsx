import { FaMinusCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { NormalSelect } from "../selectors/NormalSelect";
import {
  categoryJoiSchema
} from "../../validators/categoryValidator";
import { IconSelector } from "../selectors/IconSelector";

const AttributeComponent = ({
  attribute,
  attributesLength,
  attributeName,
  attributeType,
  subCategoryName,
  addAttribute,
  removeAttribute,
  register,
  setValue,
  attrIndex,
}) => {
  return (
    <>
      {/* attributes box begins */}
      <div className="flex flex-col justify-center gap-2 mt-2 relative px-1 border-t py-3">
        {attributesLength > 1 && (
          <div className="flex items-center absolute top-2 right-0 gap-x-2">
            <FaMinusCircle
              className="text-xl active:text-[var(--purpleDark)] transition-colors"
              onClick={() => removeAttribute(subCategoryName, attribute.id)}
            />
            {attrIndex + 1 === attributesLength && (
              <FaPlusCircle
                className="text-xl active:text-[var(--purpleDark)] transition-colors"
                onClick={() => addAttribute(subCategoryName)}
              />
            )}
          </div>
        )}

        {attributesLength < 2 && (
          <FaPlusCircle
            className="text-xl active:text-[var(--purpleDark)] transition-colors absolute top-2 right-0"
            onClick={() => addAttribute(subCategoryName)}
          />
        )}
        {/* attribute name begins */}
        <div className="grid grid-cols-2 gap-x-2">
          <label htmlFor={attributeName} className="text-xl w-fit">
            Name
          </label>
          <label htmlFor={attributeType} className="text-xl w-fit">
            Type
          </label>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <input
            autoComplete="off"
            {...register(attributeName, {
              required: true,
            })}
            id={attributeName}
            className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
          <NormalSelect
            name={attributeType}
            register={register}
            setValue={setValue}
            optionsData={["string", "number", "boolean", "enum"]}
          />
        </div>
        {/* attribute name ends */}
      </div>
      {/* attributes box ends */}
    </>
  );
};

const SubCategory = ({
  subCategoriesLength,
  addSubCategory,
  removeSubCategory,
  subCategoryName,
  subcatIndex,
  control,
  register,
  setValue,
  watch
}) => {
  // For attributes inside each subcategory
  const {
    fields: attributes,
    append: addAttr,
    remove: removeAttr,
  } = useFieldArray({
    control,
    name: `subcategories.${subcatIndex}.attributes`,
  });

  return (
    <div className="border p-2 rounded-md relative pt-4">
      {subCategoriesLength > 1 && (
        <div className="flex items-center absolute top-2 right-2 gap-x-2">
          <FaMinusCircle
            className="text-2xl active:text-[var(--purpleDark)] transition-colors"
            onClick={removeSubCategory}
          />
          {subcatIndex + 1 === subCategoriesLength && (
            <FaPlusCircle
              className="text-2xl active:text-[var(--purpleDark)] transition-colors"
              onClick={addSubCategory}
            />
          )}
        </div>
      )}

      {subCategoriesLength < 2 && (
        <div className="flex items-center absolute top-2 right-2 gap-x-2">
          <FaPlusCircle
            className="text-2xl active:text-[var(--purpleDark)] transition-colors"
            onClick={addSubCategory}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-2">
        {/* sub category name begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor={subCategoryName} className="text-xl w-fit">
            Name
          </label>
          <input
            autoComplete="off"
            {...register(subCategoryName, { required: true })}
            id={subCategoryName}
            className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
        </div>
        {/* sub category name ends */}
        {/* icon begins */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor={`subcategories.${subcatIndex}.subcategory_icon`} className="text-xl w-fit">
            Icon
          </label>

          <IconSelector
            name={`subcategories.${subcatIndex}.subcategory_icon`}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>
        {/* icon ends */}
      </div>

      <h3 className="text-2xl mt-2">Attributes</h3>

      {attributes.map((attribute, index) => {
        return (
          <div key={attribute.id}>
            <AttributeComponent
              attkey={attribute.id}
              attribute={attribute}
              attributesLength={attributes.length}
              attributeName={`subcategories.${subcatIndex}.attributes.${index}.name`}
              attributeType={`subcategories.${subcatIndex}.attributes.${index}.type`}
              subCategoryName={subCategoryName}
              addAttribute={() => addAttr({ name: "", type: "string" })}
              removeAttribute={() => removeAttr(index)}
              register={register}
              setValue={setValue}
              attrIndex={index}
            />
          </div>
        );
      })}
    </div>
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
    setValue,
    getValues,
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
    console.log(data);
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
                    register={register}
                    setValue={setValue}
                    watch={watch}
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
