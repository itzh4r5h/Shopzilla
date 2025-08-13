import { AddressModal } from "../../components/modal/AddressModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteAddress, getAllAddress } from "../../store/thunks/userThunks";
import { MdDelete } from "react-icons/md";
import { DeleteModal } from "../../components/modal/DeleteModal";

export const ProfileAddress = () => {
  const dispatch = useDispatch();
  const { allShippingAddress, updatedAddress } = useSelector((state) => state.user);

  useEffect(() => {
    if (updatedAddress) {
      dispatch(getAllAddress());
    }
  }, [updatedAddress]);

  useEffect(() => {
    dispatch(getAllAddress());
  }, []);

  const deleteShippingAddress = (id)=>{
    dispatch(deleteAddress(id))
  }

  return (
    <>
      <h2 className="text-2xl">Shipping Address</h2>

      {allShippingAddress?.length === 0 ? (
        <h3 className="text-xl">No shipping address added yet</h3>
      ) : (
       allShippingAddress?.map((shippingAddress)=>{
        return  <article className="grid grid-cols-[5fr_1fr] items-center" key={shippingAddress._id}>
          <div className="flex flex-col justify-center gap-1 border bg-white rounded-md p-2">
            <h3 className="text-md capitalize">{shippingAddress.address}</h3>
            <h3 className="text-md capitalize">{shippingAddress.city}</h3>
            <h3 className="text-md capitalize">{shippingAddress.state}, {shippingAddress.pinCode}</h3>
            <h3 className="text-md capitalize">{shippingAddress.country}</h3>
            <h3 className="text-md capitalize">{shippingAddress.mobileNumber}</h3>
          </div>
          <span className="justify-self-end self-start flex flex-col items-center gap-5">
            <AddressModal edit={true} id={shippingAddress._id} shippingAddress={shippingAddress}/>
            <DeleteModal deleteFunction={()=>deleteShippingAddress(shippingAddress._id)} classes={'text-3xl justify-self-end active:text-[var(--purpleDark)] transition-colors'}/>
          </span>
        </article>
       })
      )}

     {allShippingAddress?.length < 5 &&  <AddressModal />}
    </>
  );
};
