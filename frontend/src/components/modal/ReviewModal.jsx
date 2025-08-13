import { useEffect, useMemo, useRef, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { FillButton } from "../buttons/FillButton";
import { OutlineButton } from "../buttons/OutlineButton";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { showError } from "../../utils/showError";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export const ReviewModal = ({
  deleteFunction,
  edit = false,
  spanClasses = "",
}) => {
  const schema = useMemo(() => {
    return Joi.object({
      rating: Joi.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating is required",
        "number.max": "Rating cannot be more than 5",
        "any.required": "Rating is required",
      }),

      comment: Joi.string().min(0).max(5000).messages({
        "string.base": "Comment must be a text string",
        "string.max": "Comment cannot exceed 5000 characters",
      }),
    });
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0, // default value
    },
    resolver: joiResolver(schema),
  });

  const submitForm = (data) => {
    console.log(data);
  };

  // this is to remember last error key from joi
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    reset();
    lastErrorKeyRef.current = null
  };

  return (
    <div>
      <span className={`${spanClasses}`} onClick={() => setOpen(true)}>
        {edit ? (
          <MdEditSquare className="text-2xl justify-self-end active:text-[var(--purpleDark)] transition-colors" />
        ) : (
          <FillButton name={"Rate Product"} />
        )}
      </span>

      {open && (
        <div className="w-full h-screen fixed top-0 left-0 right-0 bottom-0 z-999 bg-[#00000089] p-2 py-4 grid place-content-center">
          <form
            className="w-85 h-full border bg-white p-3 rounded-md"
            onSubmit={handleSubmit(submitForm)}
          >
            <h1 className="text-center text-2xl font-bold">Rate Product</h1>

            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="rating" className="text-xl w-fit">
                Rating
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rating
                    {...field}
                    value={Number(field.value)} // ensure numeric value
                    onChange={(_, value) => field.onChange(value)}
                    sx={{
                      color: "var(--purpleDark)",
                      fontSize: "3rem",
                    }}
                  />
                )}
              />
            </div>

            {/* comment begins */}
            <div className="flex flex-col justify-center gap-2 mt-4">
              <label htmlFor="comment" className="text-xl w-fit">
                Comment
              </label>
              <textarea
                {...register("comment",{required:false})}
                id="comment"
                placeholder="optional"
                className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)] h-50"
                autoComplete="off"
              />
            </div>
            {/* comment ends */}

            <div className="grid grid-cols-2 gap-5 mt-5 px-5">
              <span onClick={handleClose}>
                <OutlineButton type="button" name="Cancel" />
              </span>

              <FillButton type="submit" name="submit" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
