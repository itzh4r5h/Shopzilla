import { useEffect, useState } from "react";
import { NormalSelect } from "./NormalSelect";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  getAllAddress,
  updateAddressIndex,
} from "../../store/thunks/non_admin/userThunk";
import { AddressModal } from "../modal/AddressModal";

export const ShippingAddressSelector = () => {
  const dispatch = useDispatch();

  const { allShippingAddress, updatedAddress, shippingAddressIndex } =
    useSelector((state) => state.user);

  const [shippingAddress, setShippingAddress] = useState([]);

  useEffect(() => {
    if (!allShippingAddress) {
      dispatch(getAllAddress());
    }
  }, [allShippingAddress]);

  useEffect(() => {
    if (updatedAddress) {
      dispatch(getAllAddress());
    }
  }, [updatedAddress]);

  const { setValue, control } = useForm({
    defaultValues: {
      shippingAddress: "",
    },
  });

  useEffect(() => {
    if (allShippingAddress && allShippingAddress?.length > 0) {
      // Compute addresses immediately
      const formatted = allShippingAddress.map((address) =>
        Object.values(address).slice(0, -1).join(", ")
      );

      // Update local state
      setShippingAddress(formatted);

      // Using formatted array directly so that it will set the selector value immediately
      const selected = formatted[shippingAddressIndex - 1];
      setValue("shippingAddress", selected);
    }
  }, [allShippingAddress, shippingAddressIndex,setValue]);


  return allShippingAddress?.length < 1 ? (
    <div className="mt-3">
      <AddressModal />
    </div>
  ) : (
    <div className="flex flex-col justify-center gap-2 mt-3">
      <label htmlFor="shippingAddress" className="text-xl w-fit">
        Shipping Address
      </label>
      <NormalSelect
        name="shippingAddress"
        control={control}
        optionsData={shippingAddress}
        updateFunction={(i) => dispatch(updateAddressIndex(i))}
      />
    </div>
  );
};
