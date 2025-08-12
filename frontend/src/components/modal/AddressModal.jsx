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
import { addAddress, updateAddress } from "../../store/thunks/userThunks";
import { getIsoCode } from "../../utils/helpers";
import { MdEditSquare } from "react-icons/md";

export const AddressModal = ({
  edit = false,
  id = undefined,
  shippingAddress = undefined,
}) => {
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
  // const { user } = useSelector((state) => state.user);

  const [countryCode, setCountryCode] = useState(undefined);
  const [stateCode, setStateCode] = useState(undefined);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCountryCode(undefined);
    setStateCode(undefined);
    reset();
  };

  const submitForm = (data) => {
    if (edit) {
      handleClose()
      dispatch(updateAddress({ id, address: data }));
    } else {
      handleClose()
      dispatch(addAddress(data));
    }
    handleClose();
  };

  useEffect(() => {
    setValue("state", "");
  }, [countryCode]);

  useEffect(() => {
    setValue("city", "");
  }, [stateCode]);

  useEffect(() => {
    if (edit && shippingAddress) {
      setCountryCode(getIsoCode(shippingAddress?.country, true));
      setStateCode(
        getIsoCode(shippingAddress?.country, false, shippingAddress.state, true)
      );
    }
  }, [edit, shippingAddress]);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        {edit ? (
          <MdEditSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
        ) : (
          <OutlineButton name={"Add Address"} />
        )}
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-999 bg-[#00000089] p-2 py-4 overflow-y-auto">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="bg-white w-full border border-black p-3 flex flex-col justify-center gap-5"
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
                  defaultValue={shippingAddress?.address}
                  autoComplete="off"
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
                  defaultValue={shippingAddress?.country}
                  name="country"
                  register={register}
                  setValue={setValue}
                  setCode={setCountryCode}
                  watch={watch}
                  optionsData={Country.getAllCountries()}
                />
              </div>
              {/* country ends */}

              {/* state begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="state" className="text-xl w-fit">
                  State
                </label>
                <SelectCountryStateCity
                  defaultValue={shippingAddress?.state}
                  name="state"
                  register={register}
                  setValue={setValue}
                  setCode={setStateCode}
                  watch={watch}
                  optionsData={
                    countryCode ? State.getStatesOfCountry(countryCode) : []
                  }
                />
              </div>
              {/* state ends */}

              {/* city begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="city" className="text-xl w-fit">
                  City
                </label>
                <SelectCountryStateCity
                  defaultValue={shippingAddress?.city}
                  name="city"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  optionsData={
                    countryCode && stateCode
                      ? City.getCitiesOfState(countryCode, stateCode)
                      : []
                  }
                />
              </div>
              {/* city ends */}

              {/* pincode begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="pinCode" className="text-xl w-fit">
                  Pin Code
                </label>
                <input
                  defaultValue={shippingAddress?.pinCode}
                  autoComplete="off"
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
                  defaultValue={shippingAddress?.mobileNumber}
                  autoComplete="off"
                  {...register("mobileNumber", { required: true })}
                  id="mobileNumber"
                  type="number"
                  className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                />
              </div>
              {/* Mobile number ends */}

              <FillButton type="submit" name={edit ? "Update" : "Add"} />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
