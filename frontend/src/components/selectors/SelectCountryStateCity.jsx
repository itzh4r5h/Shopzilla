import { useRef, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

export const SelectCountryStateCity = ({
  idForLabel,
  name,
  setName,
  handleInput,
  setCode=()=>{},
  optionsData
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const closeIconRef = useRef();
  const [options, setOptions] = useState(optionsData);

  const handleOnChange = (e) => {
    handleInput(e);
    let inputValue = e.target.value.trim().toLowerCase();

    if (inputValue.toString().trim() === "") {
      setOptions(optionsData);
       setCode(undefined)
      closeIconRef.current.style.opacity = "0";
    } 
    else {
      closeIconRef.current.style.opacity = "1";
    }

    const filteredOptions = optionsData.filter((option) =>
      option.name.toLowerCase().includes(inputValue)
    );
    setOptions(filteredOptions);
  };

  const clearInput = () => {
    setOptions(optionsData);
    setName("");
    setCode(undefined)
    closeIconRef.current.style.opacity = "0";
  };

  const chooseValueOnClick = (e) => {
    const isOption = Array.from(e.target.classList).includes("option");
    if (isOption) {
      const nameAndCode = e.target.textContent.split('-')
      setName(nameAndCode[0])
      setCode(nameAndCode[1])
      closeIconRef.current.style.opacity = "1";
      setOptions(optionsData)
    }
  };

  return (
    <div className="relative">
      <span className="relative">
        <input
          type="text"
          id={idForLabel}
          value={name}
          onChange={handleOnChange}
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
      {showOptions && (
        <ul
          onClick={chooseValueOnClick}
          className="absolute z-999 bg-white border w-full h-50 rounded-md mt-1 overflow-y-auto p-3 flex flex-col gap-2"
        >
          {options.map((option, index) => {
            return (
              <li
                key={index+option.name}
                className="text-lg p-1 active:bg-[var(--grey)] hover:bg-[var(--grey)] transition-colors cursor-pointer rounded-md"
              >
                <span className="option line-clamp-1">{option.name}<span className="invisible">-{option.isoCode}</span></span>
               
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
