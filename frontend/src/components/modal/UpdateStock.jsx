import { FaTimesCircle } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch } from "react-redux";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";

export const UpdateStock = ({}) => {
  //   const schema = useMemo(() => {
  //     return attributesJoiSchema;
  //   }, []);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: joiResolver(),
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    handleClose();
  };

  useValidationErrorToast(errors);

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        <OutlineButton size="text-md" padding="px-1 py-0.5 mb-0.5" name={"update"} />
      </span>
      {open && (
        <>
          <div className="w-full h-screen fixed top-0 left-0 z-999 bg-[#00000089] p-2 py-4 overflow-y-auto grid place-items-center">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="bg-white w-full border border-black p-3 flex flex-col justify-center gap-5"
            >
              <FaTimesCircle
                className="self-end text-2xl active:text-[var(--purpleDark)] transition-colors"
                onClick={handleClose}
              />

              <h1 className="text-center text-3xl -mt-5">Update Stock</h1>

              <FillButton type="submit" name="Update" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
