import { useFieldArray } from "react-hook-form";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { AttributeComponent } from "./AttributeComponent";
import { IconSelector } from "../selectors/IconSelector";

export const SubCategory = ({
  subCategoriesLength,
  addSubCategory,
  removeSubCategory,
  subCategoryName,
  subcatIndex,
  control,
  register,
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
            control={control}
          />
        </div>
        {/* icon ends */}
      </div>

      <h3 className="text-2xl mt-2">Attributes</h3>

      {attributes.map((attribute, index) => {
        return (
          <div key={attribute.id}>
            <AttributeComponent
              attributesLength={attributes.length}
              attributeName={`subcategories.${subcatIndex}.attributes.${index}.name`}
              attributeType={`subcategories.${subcatIndex}.attributes.${index}.type`}
              addAttribute={() => addAttr({ name: "", type: "string" })}
              removeAttribute={() => removeAttr(index)}
              register={register}
              control={control}
              attrIndex={index}
            />
          </div>
        );
      })}
    </div>
  );
};