import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FillButton } from "../buttons/FillButton";
import { OutlineButton } from "../buttons/OutlineButton";

export const DeleteModal = ({ deleteFunction, classes, spanClasses = "" }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = ()=>{
    setOpen(false)
    deleteFunction()
  }

  return (
    <div>
      <span className={`${spanClasses}`} onClick={() => setOpen(true)}>
        <MdDelete className={`${classes}`} />
      </span>

      {open && (
        <div className="w-full h-screen fixed top-0 left-0 right-0 bottom-0 z-999 bg-[#00000089] p-2 py-4 grid place-content-center">
          <div className="w-85 h-50 border-2 bg-white p-2 rounded-md flex flex-col place-content-center">
            <p className="text-center text-2xl">Are you sure?</p>
            <p className="text-center text-2xl">you want to delete.</p>

            <div className="grid grid-cols-2 gap-5 mt-5 px-5">
              <span onClick={() => setOpen(false)}>
                <OutlineButton type="button" name="Cancel" />
              </span>
              <span onClick={handleDelete}>
                <FillButton type="button" name="Delete" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
