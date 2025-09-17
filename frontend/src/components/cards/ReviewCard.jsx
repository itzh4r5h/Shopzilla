import { ReviewModal } from "../modal/ReviewModal";
import { DeleteModal } from "../modal/DeleteModal";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../../store/thunks/reviewThunk";

export const ReviewCard = ({ review, id }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const handleDeleteReview = () => {
    dispatch(deleteReview(id));
  };

  return (
    <article>
      <div className="grid grid-cols-[6fr_1fr_1fr] items-center pr-2 w-full">
        <h3 className="text-lg font-medium">{review.name}</h3>
        {isLoggedIn && review.user.toString() === user._id.toString() && (
          <>
            <ReviewModal edit={true} id={id} review={review} />
            <DeleteModal deleteFunction={handleDeleteReview} />
          </>
        )}
      </div>
      <Box sx={{ "& > legend": { mt: 2 } }}>
        <Rating
          name="simple-controlled"
          value={review.rating}
          readOnly
          size="medium"
          sx={{
            color: "var(--purpleDark)", // or any CSS color
          }}
        />
      </Box>
      {review.comment.length > 0 && <p className="text-md">{review.comment}</p>}
    </article>
  );
};
