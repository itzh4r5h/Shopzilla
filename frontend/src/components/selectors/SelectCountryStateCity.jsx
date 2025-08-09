import { useRef, useState, useCallback, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import debounce from "lodash/debounce";

export const SelectCountryStateCity = ({
  defaultValue,
  name,
  register,
  setValue,
  watch,
  setCode = () => {},
  optionsData,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const closeIconRef = useRef();
  const [options, setOptions] = useState(optionsData);

  const debouncedFilter = useCallback(
    debounce((e) => {
      const inputValue = e.target.value.trim().toLowerCase();
      if (inputValue === "") {
        setOptions(optionsData);
        setCode(undefined);
        closeIconRef.current.style.opacity = "0";
      } else {
        closeIconRef.current.style.opacity = "1";
        const filteredOptions = optionsData.filter((option) =>
          option.name.toLowerCase().includes(inputValue)
        );
        setOptions(filteredOptions);
      }
    }, 300), // 300ms delay
    [optionsData]
  );

  // ✅ Update options if optionsData changes
  useEffect(() => {
    setOptions(optionsData);
  }, [optionsData]);

  // ✅ Clear value if current selection no longer exists in options
  useEffect(() => {
    const currentValue = watch(name)?.trim()?.toLowerCase();
    const found = optionsData.some(
      (opt) => opt.name.toLowerCase() === currentValue
    );

    if (!found && currentValue) {
      setValue(name, "");
      setCode(undefined);
      if (closeIconRef.current) {
        closeIconRef.current.style.opacity = "0";
      }
    }
  }, [optionsData, name, setValue, setCode, watch]);

  //  deafultValue will get if address modal is in edit mode
  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue)
    }
  }, [defaultValue]);

  const clearInput = () => {
    setShowOptions(false);
    setValue(name, "");
    setOptions(optionsData);
    setCode(undefined);
    closeIconRef.current.style.opacity = "0";
  };

  const chooseValueOnClick = (e) => {
    const target = e.target.closest("li[data-name]"); // in case span is clicked

    if (target) {
      const selectedName = target.dataset.name;
      const selectedCode = target.dataset.code;
      setValue(name, selectedName);
      setCode(selectedCode);
      closeIconRef.current.style.opacity = "1";
      setOptions(optionsData);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <span className="relative">
        <input
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
      {options.length !== 0 && showOptions && (
        <ul
          onClick={chooseValueOnClick}
          className="absolute z-999 bg-white border w-full h-50 rounded-md mt-1 overflow-y-auto p-3 flex flex-col gap-2"
        >
          {options.map((option, index) => {
            return (
              <li
                key={index + option.name}
                className="text-lg p-1 active:bg-[var(--grey)] hover:bg-[var(--grey)] transition-colors cursor-pointer rounded-md"
                data-name={option.name}
                data-code={option.isoCode}
              >
                <span className="option line-clamp-1">{option.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
