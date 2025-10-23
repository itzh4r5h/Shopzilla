import { showAlert } from "../slices/alertSlice";


export const rejectWithError = (error, dispatch, rejectWithValue) => {
  const errMsg = error.response?.data?.message || "Failed";
  dispatch(showAlert({ type: "error", message: errMsg }));
  return rejectWithValue(errMsg);
};

export const successAlert = (dispatch, msg) => {
  dispatch(showAlert({ type: "success", message: msg }));
};
