import { createSlice } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../utils/handleAsyncThunk";
import {
  sendEmailVerificationLink,
  sendOtpToEmail,
  sendPasswordResetTokenToEmail,
  verifyEmail,
} from "../../thunks/non_admin/emailThunk";


const initialState = {
  resendOtpIn: undefined,
  resendTokenIn: undefined,
  resendLinkIn: undefined,
  sending: false,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers:{
    resetResendOtpIn: (state)=>{
      state.resendOtpIn = undefined
    }
  },
  extraReducers: (builder) => {
   
    handleAsyncThunk(builder, sendEmailVerificationLink, {
      pending: (state) => {
        state.sending = true;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.resendLinkIn = action.payload.resendLinkIn;
      },
      rejected: (state, action) => {
        state.sending = false;
        state.resendLinkIn = undefined
      },
    });

    handleAsyncThunk(builder, verifyEmail, {
      fulfilled: (state, action) => {
        state.resendLinkIn = undefined;
      },
      rejected: (state, action) => {
        state.resendLinkIn = undefined;
      },
    });

    handleAsyncThunk(builder, sendPasswordResetTokenToEmail, {
      pending: (state) => {
        state.sending = true;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.resendTokenIn = action.payload.resendTokenIn;
      },
      rejected: (state, action) => {
        state.sending = false;
        state.resendTokenIn = undefined
      },
    });

    handleAsyncThunk(builder, sendOtpToEmail, {
      pending: (state) => {
        state.sending = true;
      },
      fulfilled: (state, action) => {
        state.sending = false;
        state.resendOtpIn = action.payload.resendOtpIn;
      },
      rejected: (state, action) => {
        state.sending = false;
        state.resendOtpIn = undefined
      },
    });
   
  },
});

export const { resetResendOtpIn } = emailSlice.actions;
export const emailReducer = emailSlice.reducer;
