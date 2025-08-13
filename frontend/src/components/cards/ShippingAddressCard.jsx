import React, { useEffect, useState } from "react";
import { NormalSelect } from "../selectors/NormalSelect";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getAllAddress, updateAddressIndex } from "../../store/thunks/userThunks";
import { AddressModal } from "../modal/AddressModal";
import { clearErrors, clearMessage } from "../../store/slices/userSlice";
import { toast } from "react-toastify";

export const ShippingAddressCard = () => {
  const { register, setValue } = useForm();
  const dispatch = useDispatch();

  const { allShippingAddress, error, success, message, updatedAddress,user } =
    useSelector((state) => state.user);

  const [shippingAddress, setShippingAddress] = useState([]);

  useEffect(() => {
    dispatch(getAllAddress());
  }, []);

  useEffect(() => {
    if (updatedAddress) {
      dispatch(getAllAddress());
    }
  }, [updatedAddress]);

  useEffect(() => {
    if (allShippingAddress) {
      setShippingAddress(() =>
        allShippingAddress.map((address) =>
          Object.values(address).slice(0, -1).join(", ")
        )
      );
    }
  }, [allShippingAddress]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [success, message]);

  return allShippingAddress?.length === 0 ? (
    <div className="mt-3">
        <AddressModal />
    </div>
  ) : (
    <div className="flex flex-col justify-center gap-2 mt-3">
      <label htmlFor="shippingAddress" className="text-xl w-fit">
        Shipping Address
      </label>
      <NormalSelect
        selected={shippingAddress[user?.shippingAddressIndex-1]}
        name="shippingAddress"
        defaultValue={shippingAddress[user?.shippingAddressIndex-1]}
        register={register}
        setValue={setValue}
        optionsData={shippingAddress}
        updateFunction={(i)=>dispatch(updateAddressIndex(i))}
      />
    </div>
  );
};
