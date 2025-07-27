import { useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export const NormalSelect = ({
  idForLabel,
  defaultValue,
  option,
  setOption,
  optionsData,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const dropDownIconRef = useRef();
  const [options, setOptions] = useState(optionsData);

  const openDropDown = () => {
    dropDownIconRef.current.style.rotate = "180deg";
    dropDownIconRef.current.style.color = "var(--purpleDark)";
    setShowOptions(true);
  };
  const closeDropDown = () => {
    setShowOptions(false);
    dropDownIconRef.current.style.rotate = "0deg";
    dropDownIconRef.current.style.color = "initial";
  };

  const chooseValueOnClick = (e) => {
    const isOption = Array.from(e.target.classList).includes("option");
    if (isOption) {
      const value = e.target.textContent;
      setOption(value);
    }
  };

  return (
    <div className="relative">
      <span className="relative">
        <input
          type="text"
          id={idForLabel}
          value={option || defaultValue}
          onClick={openDropDown}
          onBlur={() => setTimeout(() => closeDropDown(), 50)}
          autoComplete="off"
          readOnly
          className="bg-[var(--grey)] border rounded-md p-1 text-lg outline-none w-full pr-10 cursor-default focus:ring-2 focus:ring-[var(--purpleDark)]"
        />
        <IoIosArrowDropdownCircle
          ref={dropDownIconRef}
          className="absolute transition-all text-xl top-0 right-0 -translate-x-1/2 duration-400"
          onClick={openDropDown}
        />
      </span>
      {showOptions && (
        <ul
          onClick={chooseValueOnClick}
          className="absolute z-999 bg-white border w-full h-50 rounded-md mt-1 overflow-y-auto p-3 flex flex-col gap-2"
        >
          {options.map((option, index) => {
            return (
              <li
                key={index + option}
                className="text-lg p-1 active:bg-[var(--grey)] hover:bg-[var(--grey)] transition-colors cursor-pointer rounded-md"
              >
                <span className="option line-clamp-1">{option}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
