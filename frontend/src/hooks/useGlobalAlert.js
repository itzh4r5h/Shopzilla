import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideAlert } from "../store/slices/alertSlice";


export const useGlobalAlert = () => {
  const dispatch = useDispatch();
  const { type, message, visible } = useSelector((state) => state.alert);

  useEffect(() => {
    if (visible && message) {
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);

      dispatch(hideAlert());
    }
  }, [visible, message, type, dispatch]);
};

