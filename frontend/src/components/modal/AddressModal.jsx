import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { SelectCountryStateCity } from "../selectors/SelectCountryStateCity";
import { Country, State, City } from "country-state-city";

export const AddressModal = () => {
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
  } = useForm();

  const [open, setOpen] = useState(false);

  useEffect(()=>{
    if(!countryCode || !stateCode){
      setState('')
      setStateCode(undefined)
      setCity('')
    }
  },[countryCode,stateCode])


  const handleClose = ()=>{
    setOpen(false)
    setCountry('')
    setCountryCode(undefined)
    setState('')
    setStateCode(undefined)
    setCity('')
    reset()
  }

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton name={"Add Address"} />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-100 bg-[#00000063]"></div>
          <form
            onSubmit={handleSubmit((data) => console.log(data))}
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
                handleInput={(e)=>{setCountry(e.target.value)}}
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
                  handleInput={(e)=>{setState(e.target.value)}}
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
                  handleInput={(e)=>{setCity(e.target.value)}}
                  optionsData={City.getCitiesOfState(countryCode,stateCode)}
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

            <span>
              <FillButton name={"Add"} />
            </span>
          </form>
        </>
      )}
    </div>
  );
};
