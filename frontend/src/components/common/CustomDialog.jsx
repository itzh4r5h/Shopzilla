import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { FaTimesCircle } from "react-icons/fa";

export const CustomDialog = ({children, open, handleClose, title }) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      scroll='paper'
      slotProps={{
        paper: {
          className: "bg-white w-full border-2 border-black",
          sx:{m:1}
        },
      }}
    >
      <span className="flex justify-end pr-3 pt-2">
        <FaTimesCircle
        className="text-2xl active:text-[var(--purpleDark)] transition-colors relative z-99"
        onClick={handleClose}
      />
      </span>

      <DialogTitle
        sx={{ m: 0,p:0, pb:1, mt:-1, textAlign: "center", fontSize: "1.8rem" }}
        id="customized-dialog-title"
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{padding:2}}>{children}</DialogContent>
    </Dialog>
  );
};
