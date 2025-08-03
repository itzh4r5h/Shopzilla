import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { SelectCountryStateCity } from "../selectors/SelectCountryStateCity";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { showError } from "../../utils/showError";
import { useDispatch, useSelector } from "react-redux";

export const AddressModal = () => {
  const schema = useMemo(() => {
    return Joi.object({
      address: Joi.string().trim().max(255).required().messages({
        "string.empty": "Address is required",
        "string.max": "Address must be at most 255 characters",
      }),

      country: Joi.string().trim().max(85).required().messages({
        "string.empty": "Country is required",
        "string.max": "Country must be at most 85 characters",
      }),

      state: Joi.string().trim().max(85).required().messages({
        "string.empty": "State is required",
        "string.max": "State must be at most 85 characters",
      }),

      city: Joi.string().trim().max(85).required().messages({
        "string.empty": "City is required",
        "string.max": "City must be at most 85 characters",
      }),

      pinCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.empty": "Pin code is required",
          "string.length": "Pin code must be exactly 6 digits",
          "string.pattern.base": "Pin code must contain only digits",
        }),

      mobileNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.empty": "Mobile number is required",
          "string.length": "Mobile number must be exactly 10 digits",
          "string.pattern.base": "Mobile number must contain only digits",
        }),
    });
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [countryCode, setCountryCode] = useState(undefined);
  const [stateCode, setStateCode] = useState(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setState("");
      setStateCode(undefined);
      setCity("");
    }
  }, [countryCode, stateCode]);

  const handleClose = () => {
    setOpen(false);
    setCountry("");
    setCountryCode(undefined);
    setState("");
    setStateCode(undefined);
    setCity("");
    reset();
  };

  const submitForm = (data) => {
    console.log(data);
  };

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton name={"Add Address"} />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-100 bg-[#00000063]"></div>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="bg-white border border-black w-full absolute z-200 top-0 p-3 flex flex-col justify-center gap-5"
          >
            <FaTimesCircle
              className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
              onClick={handleClose}
            />

            <h1 className="text-center text-3xl -mt-5">Shipping Address</h1>

            {/* address begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="address" className="text-xl w-fit">
                Address
              </label>
              <input
                {...register("address", { required: true })}
                id="address"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* address ends */}

            {/* country begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="country" className="text-xl w-fit">
                Country
              </label>
              <SelectCountryStateCity
                idForLabel={"country"}
                name={country}
                handleInput={(e) => {
                  setCountry(e.target.value);
                }}
                setName={setCountry}
                setCode={setCountryCode}
                optionsData={Country.getAllCountries()}
              />
            </div>
            {/* country ends */}

            {/* state begins */}
            {countryCode && (
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="state" className="text-xl w-fit">
                  State
                </label>
                <SelectCountryStateCity
                  idForLabel={"state"}
                  name={state}
                  setName={setState}
                  handleInput={(e) => {
                    setState(e.target.value);
                  }}
                  setCode={setStateCode}
                  optionsData={State.getStatesOfCountry(countryCode)}
                />
              </div>
            )}
            {/* state ends */}

            {/* city begins */}
            {countryCode && stateCode && (
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="city" className="text-xl w-fit">
                  City
                </label>
                <SelectCountryStateCity
                  idForLabel={"city"}
                  name={city}
                  setName={setCity}
                  handleInput={(e) => {
                    setCity(e.target.value);
                  }}
                  optionsData={City.getCitiesOfState(countryCode, stateCode)}
                />
              </div>
            )}
            {/* city ends */}

            {/* pincode begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="pinCode" className="text-xl w-fit">
                Pin Code
              </label>
              <input
                {...register("pinCode", { required: true })}
                type="number"
                id="pinCode"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* pincode ends */}

            {/* Mobile number begins */}
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="mobileNumber" className="text-xl w-fit">
                Mobile Number
              </label>
              <input
                {...register("mobileNumber", { required: true })}
                id="mobileNumber"
                type="number"
                className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
              />
            </div>
            {/* Mobile number ends */}

            <FillButton type="submit" name={"Add"} />
          </form>
        </>
      )}
    </div>
  );
};
