import React from "react";
import { ReviewModal } from "../modal/ReviewModal";
import { DeleteModal } from "../modal/DeleteModal";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";

export const ReviewCard = ({review}) => {
    const dispatch = useDispatch()
    const {isLoggedIn} = useSelector((state)=>state.user)

    const handleDeleteReview = ()=>{
        console.log('delete review');
    }

  return (
    <div className="flex flex-col gap-0 justify-center">
      <div className="grid grid-cols-[6fr_1fr_1fr] items-center pr-2">
        <h3 className="text-lg font-medium">Abhishek singh</h3>
       {isLoggedIn && <>
        <ReviewModal edit={true}/>
        <DeleteModal deleteFunction={handleDeleteReview} classes={'text-[1.65rem] justify-self-end active:text-[var(--purpleDark)] transition-colors'}/>
        </>}
      </div>
      <Box sx={{ "& > legend": { mt: 2 } }}>
        <Rating
          name="simple-controlled"
          value={4}
          readOnly
          size="medium"
          sx={{
            color: "var(--purpleDark)", // or any CSS color
          }}
        />
      </Box>
      <p className="text-md">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem,
        praesentium!
      </p>
    </div>
  );
};
