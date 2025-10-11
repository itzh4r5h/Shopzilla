import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { NormalSelect } from "../selectors/NormalSelect";

export const AttributeComponent = ({
  attributesLength,
  attributeName,
  attributeType,
  addAttribute,
  removeAttribute,
  register,
  control,
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
              onClick={removeAttribute}
            />
            {attrIndex + 1 === attributesLength && (
              <FaPlusCircle
                className="text-xl active:text-[var(--purpleDark)] transition-colors"
                onClick={addAttribute}
              />
            )}
          </div>
        )}

        {attributesLength < 2 && (
          <FaPlusCircle
            className="text-xl active:text-[var(--purpleDark)] transition-colors absolute top-2 right-0"
            onClick={addAttribute}
          />
        )}
        {/* attribute name begins */}
        <div className="flex flex-col gap-2">
          <label htmlFor={attributeName} className="text-xl w-fit">
            Name
          </label>
          <input
            autoComplete="off"
            {...register(attributeName, {
              required: true,
            })}
            id={attributeName}
            className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
        </div>
        {/* attribute name ends */}
      </div>
      {/* attributes box ends */}
    </>
  );
};