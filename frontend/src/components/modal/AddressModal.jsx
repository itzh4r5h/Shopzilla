import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { SelectCountryStateCity } from "../selectors/SelectCountryStateCity";
import { Country, State, City } from "country-state-city";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import {
  addAddress,
  updateAddress,
} from "../../store/thunks/non_admin/userThunk";
import { getIsoCode } from "../../utils/helpers";
import { MdEditSquare } from "react-icons/md";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { shippingAddressJoiSchema } from "../../validators/userValidator";
import { CustomDialog } from "../common/CustomDialog";


export const AddressModal = ({
  edit = false,
  id = undefined,
  shippingAddress = undefined,
}) => {
  const schema = useMemo(() => {
    return shippingAddressJoiSchema;
  }, []);

  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState(undefined);
  const [stateCode, setStateCode] = useState(undefined);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCountryCode(undefined);
    setStateCode(undefined);
    reset();
  };

  const submitForm = (data) => {
    data.address = data.address.toLowerCase();
    if (edit) {
      handleClose();
      dispatch(updateAddress({ id, address: data }));
    } else {
      handleClose();
      dispatch(addAddress(data));
    }
  };

  useValidationErrorToast(errors);

  useEffect(() => {
    if (open && edit && shippingAddress) {
      setCountryCode(getIsoCode(shippingAddress?.country, true));
      setStateCode(
        getIsoCode(shippingAddress?.country, false, shippingAddress.state, true)
      );

      // Initialize form values once
      reset({
        address: shippingAddress.address,
        country: shippingAddress.country,
        state: shippingAddress.state,
        city: shippingAddress.city,
        pinCode: `${shippingAddress.pinCode}`,
        mobileNumber: `${shippingAddress.mobileNumber}`,
      });
    }
  }, [open, edit, shippingAddress, reset]);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        {edit ? (
          <MdEditSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
        ) : (
          <OutlineButton name={"Add Address"} />
        )}
      </span>

        <CustomDialog open={open} handleClose={handleClose} title={'Shipping Address'}>
         <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col justify-center gap-5"
            >
              {/* address begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="address" className="text-xl w-fit">
                  Address
                </label>
                <input
                  autoComplete="off"
                  {...register("address", { required: true })}
                  id="address"
                  className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                />
              </div>
              {/* address ends */}

              {/* country begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="country" className="text-xl w-fit">
                  Country
                </label>
                <SelectCountryStateCity
                  name="country"
                  control={control}
                  setCode={setCountryCode}
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
                  name="state"
                  control={control}
                  setCode={setStateCode}
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
                  name="city"
                  control={control}
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
        </CustomDialog>

      
    </div>
  );
};
