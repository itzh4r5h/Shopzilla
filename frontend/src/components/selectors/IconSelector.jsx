import { useRef, useState, useCallback, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import debounce from "lodash/debounce";
import { category_icons } from "../../utils/category_icons";
import { ImageCard } from "../cards/ImageCard";

export const IconSelector = ({
  name,
  register,
  setValue,
  watch,
}) => {
  const optionsData = Object.keys(category_icons);
  const [showOptions, setShowOptions] = useState(false);
  const closeIconRef = useRef();
  const [options, setOptions] = useState(optionsData);

  const debouncedFilter = useCallback(
    debounce((e) => {
      const inputValue = e.target.value.trim().toLowerCase();
      if (inputValue === "") {
        setOptions(optionsData);
        closeIconRef.current.style.opacity = "0";
      } else {
        closeIconRef.current.style.opacity = "1";
        const filteredOptions = optionsData.filter((option) =>
          option.toLowerCase().includes(inputValue)
        );
        setOptions(filteredOptions);
      }
    }, 300), // 300ms delay
    [optionsData]
  );

  // ✅ Clear value if current selection no longer exists in options
  useEffect(() => {
    const currentValue = watch(name)?.trim()?.toLowerCase();
    const found = optionsData.some(
      (opt) => opt.toLowerCase() === currentValue
    );

    if (!found && currentValue) {
      setValue(name, "");
      if (closeIconRef.current) {
        closeIconRef.current.style.opacity = "0";
      }
    }

  }, [optionsData, name, setValue, watch]);

  const clearInput = () => {
    setShowOptions(false);
    setValue(name, "");
    setOptions(optionsData);
    closeIconRef.current.style.opacity = "0";
  };

  const chooseValueOnClick = (e) => {
    const target = e.target.closest("li[data-name]"); // in case span is clicked

    if (target) {
      const selectedName = target.dataset.name;
      setValue(name, selectedName, { shouldValidate: true });
      closeIconRef.current.style.opacity = "1";
      setOptions(optionsData);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <span className="relative">
        <input
        placeholder="Select Icon..."
          type="text"
          id={name}
          {...register(name, { required: true })}
          onChange={debouncedFilter}
          onFocus={() => setShowOptions(true)}
          onBlur={() => setTimeout(() => setShowOptions(false), 50)}
          autoComplete="off"
          className="bg-[var(--grey)] border rounded-md p-1 text-lg outline-none w-full pr-10 focus:ring-2 focus:ring-[var(--purpleDark)]"
        />
        <FaTimesCircle
          ref={closeIconRef}
          className="absolute opacity-0 transition-all text-xl top-0 right-0 -translate-x-1/2 active:text-[var(--purpleDark)]"
          onClick={clearInput}
        />
      </span>
      {options.length > 0 && showOptions && (
        <ul
          onClick={chooseValueOnClick}
          className="absolute z-999 bg-white border w-full h-50 rounded-md mt-1 overflow-y-auto p-2 flex flex-col gap-2"
        >
          {options.map((option, index) => {
            return (
              <li
                key={index}
                className="text-lg p-1 active:bg-[var(--grey)] hover:bg-[var(--grey)] transition-colors cursor-pointer rounded-md"
                data-name={option}
              >
                <span className="grid grid-rows-2 items-center justify-center">
                  <picture className="relative h-10 w-fit block overflow-hidden justify-self-center">
                    <ImageCard
                      src={{
                        url: category_icons[option],
                        name: option,
                      }}
                    />
                  </picture>
                  <span className="option line-clamp-1">{option}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
