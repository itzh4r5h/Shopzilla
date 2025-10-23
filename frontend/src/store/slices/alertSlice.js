import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,     // "success" | "error"
  message: null,  // message text
  visible: false, // whether to show the alert
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.visible = true;
    },
    hideAlert: (state) => {
      state.type = null;
      state.message = null;
      state.visible = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export const alertReducer =  alertSlice.reducer;
